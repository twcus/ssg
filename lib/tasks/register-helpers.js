const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');

/**
 * Register Handlebars helpers from the helpers directory, using the filename as the helper name.
 */
class RegisterHelpersTask extends BuildTask {
    async run() {
        console.log('registering helpers');
        let files = this.options.fileList || await fsp.readdir(this.site.config.helpersDir);
        console.log(files);
        this.registerHelpers(files);
    }

    registerHelpers(files) {
        files.forEach(file => {
            const helperName = path.parse(file).name;
            const helper = require(path.resolve(this.site.config.helpersDir, file));
            this.site.renderer.registerHelper(helperName, helper);
        });
    }
}

module.exports = RegisterHelpersTask;