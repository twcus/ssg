const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const Page = require('../page');

/**
 * Create a Page object for every file in the pages directory.
 */
class ReadPagesTask extends BuildTask {
    async run() {
        console.log('reading pages');
        const pagesDir = this.site.config.pagesDir;
        try {
            let files = await fsp.readdir(pagesDir);
            console.log(files);
            await Promise.all(files.map(async (file) => {
                const page = new Page(this.site, path.join(pagesDir, file));
                this.site.pages.push(page);
                return page.read();
            }));
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = ReadPagesTask;
