[![Travis](http://travis-ci.org/typekpb/oradown.png?branch=master)](http://travis-ci.org/typekpb/oradown) 

# oradown
Enables download of the SSO protected files from the Oracle website.

# Usage

    USAGE: node oradown [OPTION1] [OPTION2]... <ARG1> <ARG2>...
    The following options are supported:
    --accept_license              Accept Oracle license? (mandatory)
    -f, --file <ARG1>             Remote filename to download (value of <a name=""> argument) (mandatory)
    --outDir <ARG1>               Name of the directory to download to (current dir if not provided)
    --outFile <ARG1>              Filename to download to (if absolute path is provided, option outDir is ignored)
    -l, --oralogin <ARG1>         Oracle login (mandatory)
    -p, --orapwd <ARG1>           Oracle password (mandatory)
    -u, --url <ARG1>              Oracle URL for download site (mandatory)
    -s, --showbrowser             Show the browser while interacting with site?
