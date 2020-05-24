const fs = require('fs');
const path = require('path');
const Layout = require('../layout');

/**
 * Creates a Layout object for every file in the layout directory.
 */
const readContent = function(site) {
    console.log('reading layouts');
    const layoutsDir = site.config.layoutsDir;
    try {
        let files = fs.readdirSync(layoutsDir);
        console.log(files);
        files.forEach(f => {
            site.layouts[path.parse(f).name] = new Layout(site, path.join(layoutsDir, f));
        });
    } catch(err) {
        console.log(err);
    }
};

module.exports = readContent;
