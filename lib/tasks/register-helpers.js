const fs = require('fs');
const path = require('path');

/**
 * Register custom Handlebars helpers in the helpers directory, using the filename as the helper name.
 * TODO allow for nested helper dirs, only update helpers from files that changed
 */
const registerHelpers = function(site) {
    console.log('registering helpers');
    const helpersPath = site.config.helpersDir;
    try {
        let files = fs.readdirSync(helpersPath);
        console.log(files);
        files.forEach(f => {
            const helperName = path.parse(f).name;
            const helper = require(path.resolve(helpersPath, f));
            site.renderer.registerHelper(helperName, helper);
        });
    } catch(err) {
        console.log(err);
    }
};

module.exports = registerHelpers;
