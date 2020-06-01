const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const fileList = require('../utils/fileList');

/**
 * Register Handlebars partials from the partials directory, using the filename as the partial name.
 * TODO Allow for nested directories, for now only reads top-level files.
 */
class RegisterPartialsTask extends BuildTask {
    async run() {
        console.log('registering partials');
        const files = this.options.files || await fileList(this.site.config.partialsDir);
        console.log(files);
        await this.registerPartials(files);
    }

    async registerPartials(files) {
        await Promise.all(files.map(async (file) => {
            const fileContent = (await fsp.readFile(`${this.site.config.partialsDir}/${file}`)).toString();
            return this.site.registerPartial(path.parse(file).name, fileContent);
        }));
    }
}

module.exports = RegisterPartialsTask;
