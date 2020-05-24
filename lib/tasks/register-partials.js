const fs = require('fs');
const path = require('path');

/**
 * Register custom Handlebars partials in the partials directory, using the filename as the partial name.
 * TODO allow for nested partial dirs, only update partials from files that changed
 */
const registerPartials = function(site) {
    console.log('registering partials');
    const partialsPath = site.config.partialsDir;
    try {
        let files = fs.readdirSync(partialsPath);
        console.log(files);
        files.forEach(f => {
            const fileContent = fs.readFileSync(`${partialsPath}/${f}`).toString();
            site.renderer.registerPartial(path.parse(f).name, fileContent);
        });
    } catch(err) {
        console.log(err);
    }
};

module.exports = registerPartials;
