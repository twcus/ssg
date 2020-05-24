const fs = require('fs');

/**
 * Writes the rendered HTML pages to the output directory.
 */
const writePages = function(site) {
    site.content.forEach(page => {
        page.writeFile();
    });
    site.pages.forEach(page => {
        page.writeFile();
    });
};

module.exports = writePages;
