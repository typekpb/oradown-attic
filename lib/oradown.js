/**
 * Downloads the file from the Oracle website
 *
 * @param accept_license Accept Oracle license?
 * @param file Remote file to download on the url (value of <a name=""> argument).
 * @param outDir Name of the directory to download to (current dir if not provided).
 * @param outFile Filename to download to (if absolute path is provided, option outDir is ignored).
 * @param oralogin Oracle login.
 * @param orapwd Oracle password.
 * @param url Oracle URL for download site.
 * @param showbrowser Show the browser while interacting with site?
 */
var oradown = function(accept_license, file, outDir, outFile, oralogin, orapwd, url, showbrowser) {

    var path = require('path')
    var pathIsAbsolute = require('path-is-absolute');

    if (!accept_license) {
        console.log('No downloads without accepting the license!');
        process.exit(1)
    }

    var Nightmare = require('nightmare');
    require('nightmare-download-manager')(Nightmare);
    var nightmare = Nightmare({ show: showbrowser });

    nightmare.on('download', function(state, downloadItem) {
        if (state == 'started') {
            var toFile = outFile;
            var toDir = outDir;
            if (!toFile) {
                toFile = downloadItem.filename
            }
            if (!pathIsAbsolute(toFile)) {
                if (!toDir) {
                    toFile = path.join(__dirname, toFile);
                } else {
                    toFile = path.join(outDir, toFile);
                }
            }

            console.log('Downloading: ' + downloadItem.url + ' to: ' + toFile);
            nightmare.emit('download', toFile, downloadItem);
        }
    });

    nightmare
        .downloadManager()
        // clear any pre-filled stuff
        .cookies.clearAll()
        .goto(url)
        .click('input[onclick^="acceptAgreement"]')
        .wait('a[name=' + file + ']')
        .click('a[name=' + file + ']')
        .wait('form[name=LoginForm]')
        .insert('input#sso_username', oralogin)
        .insert('input#ssopassword', orapwd)
        .click('a[class=submit_btn]')
        .waitDownloadsComplete()
        .end()
        .then(function(result) {
            console.log("Download done")
        })
        .catch(function(error) {
            console.error('Download failed:', error);
        });

    return outFile
}

exports.oradown = oradown;