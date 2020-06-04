const fsp = require('fs').promises;
const path = require('path');
const Layout = require('../layout');
const BuildTask = require('../build-task');
const fileList = require('../utils/fileList');
const filterFiles = require('../utils/filterFiles');

/**
 * Load the layouts from the layouts directory.
 * TODO Allow for nested directories, for now only reads top-level files.
 */
class ReadLayoutsTask extends BuildTask {
    async run() {
        console.log('reading layouts');
        const files = this.options.files || filterFiles(await fileList(this.site.config.layoutsDir));
        console.log(files);
        await this.readLayouts(files);
    }

    async readLayouts(files) {
        await Promise.all(files.map(async (file) => {
            const filename = path.parse(file).name;
            const currentLayout = this.site.layoutMap[filename];
            const layoutPages = this.site.content.filter(page => page.layoutName === filename);
            layoutPages.forEach(page => page.isCompiled = false);
            if (currentLayout) {
                return currentLayout.read();
            } else {
                const layout = new Layout(this.site, path.join(this.site.config.layoutsDir, file));
                this.site.layoutMap[filename] = layout;
                return layout.read();
            }
        }));
    }
}

module.exports = ReadLayoutsTask;
