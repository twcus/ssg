const BuildTask = require('../build-task');

/**
 * Writes the rendered HTML pages to the build directory.
 */
class WritePagesTask extends BuildTask {
    async run() {
        console.log('writing pages');
        console.log(this.site.writablePages.map(page => page.sourcePath));
        await Promise.all(this.site.writablePages.map(page => page.write()));
    }
}

module.exports = WritePagesTask;
