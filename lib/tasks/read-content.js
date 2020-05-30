const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const ContentPage = require('../content-page');

/**
 * Create a ContentPage object for every file in the content directory.
 */
class ReadContentTask extends BuildTask {
    async run() {
        console.log('reading content');
        const contentDir = this.site.config.contentDir;
        try {
            let files = await fsp.readdir(contentDir);
            console.log(files);
            await Promise.all(files.map(async (file) => {
                const contentPage = new ContentPage(this.site, path.join(contentDir, file));
                this.site.content.push(contentPage);
                return contentPage.read();
            }));
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = ReadContentTask;
