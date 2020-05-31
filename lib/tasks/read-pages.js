const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const Page = require('../page');

/**
 * Create a Page object for every file in the pages directory.
 */
class ReadPagesTask extends BuildTask {
    async run() {
        await this.readPages(this.site.config.pagesDir);
    }

    /**
     * Creates Pages for all files in the content directory.
     * @param {string} dir The directory of files to read content from.
     */
    async readPages(dir) {
        const entries = await fsp.readdir(dir, { withFileTypes: true });
        await Promise.all(entries.map(async (entry) => {
            const entryPath = path.join(dir, entry.name);
            if (entry.isFile()) {
                const page = new Page(this.site, entryPath);
                this.site.pages.push(page);
                return page.read().then(() => page.compile());
            } else {
                return this.readPages(entryPath);
            }
        }));
    }
}

module.exports = ReadPagesTask;
