const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');

/**
 * Register Handlebars helpers from the helpers directory, using the filename as the helper name.
 */
class RegisterHelpersTask extends BuildTask {
    async run() {
        console.log('registering helpers');
        const helpersPath = this.site.config.helpersDir;
        try {
            let files = await fsp.readdir(helpersPath);
            console.log(files);
            files.forEach(file => {
                const helperName = path.parse(file).name;
                const helper = require(path.resolve(helpersPath, file));
                this.site.renderer.registerHelper(helperName, helper);
            });
        } catch(err) {
            console.log(err);
        }
    }
}


module.exports = RegisterHelpersTask;
