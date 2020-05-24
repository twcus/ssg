const fs = require('fs');
const path = require('path');
const ContentPage = require('../content-page');

/**
 * Creates a ContentPage object for every file in the content directory.
 * TODO allow for nested content dirs, only update content from files that changed
 */
const readContent = function(site) {
    console.log('reading content');
    const contentDir = site.config.contentDir;
    try {
        let files = fs.readdirSync(contentDir);
        console.log(files);
        files.forEach(f => {
            site.content.push(new ContentPage(site, path.join(contentDir, f)));
        });
    } catch(err) {
        console.log(err);
    }
};

module.exports = readContent;
