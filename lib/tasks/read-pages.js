const fs = require('fs');
const path = require('path');
const Page = require('../page');

/**
 * Creates a Page object for every file in the pages directory.
 */
const readPages = function(site) {
    console.log('reading pages');
    const pagesDir = site.config.pagesDir;
    try {
        let files = fs.readdirSync(pagesDir);
        console.log(files);
        files.forEach(f => {
            site.content.push(new Page(site, path.join(pagesDir, f)));
        });
    } catch(err) {
        console.log(err);
    }
};

module.exports = readPages;
