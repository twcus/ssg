const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');

/**
 * Register Handlebars helpers from the helpers directory, using the filename as the helper name.
 */
class RegisterHelpersTask extends BuildTask {
    async run() {
        console.log('registering helpers');
        const files = this.options.files || await fsp.readdir(this.site.config.helpersDir);
        console.log(files);
        this.registerHelpers(files);
    }

    registerHelpers(files) {
        files.forEach(file => {
            const helperName = path.parse(file).name;
            const resolvedPath = path.resolve(this.site.config.helpersDir, file);
            delete require.cache[resolvedPath];
            const helper = require(resolvedPath);
            this.site.registerHelper(helperName, helper);
        });
    }
}

module.exports = RegisterHelpersTask;