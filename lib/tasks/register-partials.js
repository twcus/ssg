const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');

/**
 * Register Handlebars partials from the partials directory, using the filename as the partial name.
 */
class RegisterPartialsTask extends BuildTask {
    async run() {
        console.log('registering partials');
        const partialsPath = this.site.config.partialsDir;
        try {
            let files = await fsp.readdir(partialsPath);
            console.log(files);
            await Promise.all(files.map(async (file) => {
                const fileContent = (await fsp.readFile(`${partialsPath}/${file}`)).toString();
                return this.site.registerPartial(path.parse(file).name, fileContent);
            }));
        } catch(err) {
            console.log(err);
        }
    }    
}

module.exports = RegisterPartialsTask;
