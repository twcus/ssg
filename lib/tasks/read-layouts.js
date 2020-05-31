const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const Layout = require('../layout');

/**
 * Load the layouts from the layouts directory.
 */
class ReadLayoutsTask extends BuildTask {
    async run() {
        console.log('reading layouts');
        const layoutsDir = this.site.config.layoutsDir;
        try {
            let files = await fsp.readdir(layoutsDir);
            console.log(files);
            await Promise.all(files.map(async (file) => {
                const layout = new Layout(this.site, path.join(layoutsDir, file));
                this.site.layoutMap[path.parse(file).name] = layout;
                return layout.read();
            }));
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = ReadLayoutsTask;
