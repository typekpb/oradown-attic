var exec = require('shelljs').exec;
var sprintf = require('sprintf-js').sprintf;
var fs = require('fs');
var verbose = false;
var testUrl = 'http://www.oracle.com/technetwork/middleware/weblogic/downloads/wls-for-dev-1703574.html';
// <a href="http://download.oracle.com/otn/nt/middleware/12c/12212/D-PCT-12212.zip" name="file55" class="boldbodylink" id="file55" onclick="youMustAgreePrompt();">Domain To Partition Conversion Tool  </a>
// (53 KB) | 
var testFile = 'file55';
var testOraLogin = process.env.ORA_LOGIN;
var testOraPwd = process.env.ORA_PWD;

describe("without --accept_license", function() {
    it("returns error code 255", function() {
        expect(exec('bin/oradown', { silent: !verbose }).code).toBe(255);
    });
    it("prints error msg", function() {
        expect(exec('bin/oradown', { silent: !verbose }).stdout).toBe('Missing "accept_license" argument.\nTry "--help" for more information.\n');
    });
});

describe("without --file", function() {
    it("returns error code 255", function() {
        expect(exec('bin/oradown --accept_license', { silent: !verbose }).code).toBe(255);
    });
    it("prints error msg", function() {
        expect(exec('bin/oradown --accept_license', { silent: !verbose }).stdout).toBe('Missing "file" argument.\nTry "--help" for more information.\n');
    });
});

describe("without --oralogin", function() {
    it("returns error code 255", function() {
        expect(exec('bin/oradown --accept_license --file=foo', { silent: !verbose }).code).toBe(255);
    });
    it("prints error msg", function() {
        expect(exec('bin/oradown --accept_license --file=foo', { silent: !verbose }).stdout).toBe('Missing "oralogin" argument.\nTry "--help" for more information.\n');
    });
});

describe("without --orapwd", function() {
    it("returns error code 255", function() {
        expect(exec('bin/oradown --accept_license --file=foo --oralogin=foo', { silent: !verbose }).code).toBe(255);
    });
    it("prints error msg", function() {
        expect(exec('bin/oradown --accept_license --file=foo --oralogin=foo', { silent: !verbose }).stdout).toBe('Missing "orapwd" argument.\nTry "--help" for more information.\n');
    });
});

describe("without --url", function() {
    it("returns error code 255", function() {
        expect(exec('bin/oradown --accept_license --file=foo --oralogin=foo --orapwd=foo', { silent: !verbose }).code).toBe(255);
    });
    it("prints error msg", function() {
        expect(exec('bin/oradown --accept_license --file=foo --oralogin=foo --orapwd=foo', { silent: !verbose }).stdout).toBe('Missing "url" argument.\nTry "--help" for more information.\n');
    });
});

describe("without --outDir and --outFile", function() {
    var realFile = 'lib/' + 'D-PCT-12212.zip';

    beforeEach(function() {
        deleteIfExists(realFile);
    });
    afterEach(function() {
        deleteIfExists(realFile);
    });

    it("downloads file next to oradown.js using original filename", function() {
        expect(exec(sprintf('bin/oradown --accept_license --file="%s" --oralogin="%s" --orapwd="%s" --url="%s"', testFile, testOraLogin, testOraPwd, testUrl), { silent: !verbose }).code).toBe(0);
        expect(fs.existsSync(realFile)).toBe(true);
        expect(md5OfFile(realFile)).toBe('46d0887f964b21047786eae5f10bfa0e');
    });
});

describe("with --outDir relative", function() {
    var targetDir = 'foo';
    var realFile = targetDir + '/D-PCT-12212.zip';

    beforeEach(function() {
        deleteIfExists(realFile);
    });
    afterEach(function() {
        deleteIfExists(realFile);
    });

    it("downloads file relative to oradown.js using original filename", function() {
        expect(exec(sprintf('bin/oradown --accept_license --file="%s" --oralogin="%s" --orapwd="%s" --url="%s" --outDir="%s"', testFile, testOraLogin, testOraPwd, testUrl, targetDir), { silent: !verbose }).code).toBe(0);
        expect(fs.existsSync(realFile)).toBe(true);
        expect(md5OfFile(realFile)).toBe('46d0887f964b21047786eae5f10bfa0e');
    });
});

describe("with --outDir absolute", function() {
    var targetDir = '/tmp/oradown';
    var realFile = targetDir + '/D-PCT-12212.zip';

    beforeEach(function() {
        deleteIfExists(realFile);
    });
    afterEach(function() {
        deleteIfExists(realFile);
    });

    it("downloads file to dir using original filename", function() {
        expect(exec(sprintf('bin/oradown --accept_license --file="%s" --oralogin="%s" --orapwd="%s" --url="%s" --outDir="%s"', testFile, testOraLogin, testOraPwd, testUrl, targetDir), { silent: !verbose }).code).toBe(0);
        expect(fs.existsSync(realFile)).toBe(true);
        expect(md5OfFile(realFile)).toBe('46d0887f964b21047786eae5f10bfa0e');
    });
});

describe("with --outFile relative", function() {
    var targetFile = 'foo.zip';
    var realFile = 'lib/' + targetFile;

    beforeEach(function() {
        deleteIfExists(realFile);
    });
    afterEach(function() {
        deleteIfExists(realFile);
    });

    it("downloads file relative to oradown.js", function() {
        expect(exec(sprintf('bin/oradown --accept_license --file="%s" --oralogin="%s" --orapwd="%s" --url="%s" --outFile="%s"', testFile, testOraLogin, testOraPwd, testUrl, targetFile), { silent: !verbose }).code).toBe(0);
        expect(fs.existsSync(realFile)).toBe(true);
        expect(md5OfFile(realFile)).toBe('46d0887f964b21047786eae5f10bfa0e');
    });
});

describe("with --outFile absolute", function() {
    var targetFile = '/tmp/oradown/foo.zip';

    beforeEach(function() {
        deleteIfExists(targetFile);
    });
    afterEach(function() {
        deleteIfExists(targetFile);
    });

    it("downloads file", function() {
        expect(exec(sprintf('bin/oradown --accept_license --file="%s" --oralogin="%s" --orapwd="%s" --url="%s" --outFile="%s"', testFile, testOraLogin, testOraPwd, testUrl, targetFile), { silent: !verbose }).code).toBe(0);
        expect(fs.existsSync(targetFile)).toBe(true);
        expect(md5OfFile(targetFile)).toBe('46d0887f964b21047786eae5f10bfa0e');
    });
});

function md5OfFile(file) {
    var md5 = require('md5');
    if (!fs.existsSync(file)) {
        return '';
    }
    return md5(fs.readFileSync(file));
}

function deleteIfExists(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}