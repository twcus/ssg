const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const Page = require('../page');
const filterFiles = require('../utils/filterFiles');

/**
 * Create a Page object for every file in the pages directory.
 */
class ReadPagesTask extends BuildTask {
    async run() {
        console.log('reading pages');
        if (this.options.files) {
            return await this.readPageFiles(this.options.files);
        } else {
            return await this.readPages(this.site.config.pagesDir);
        }
    }

    /**
     * Read all Pages from the given directory.
     * @param {string} dir The directory of files to read from.
     */
    async readPages(dir) {
        // TODO Need to ignore hidden and temp files (e.g. files ending in ~ created by Idea)
        const entries = filterFiles(await fsp.readdir(dir, { withFileTypes: true }));
        await Promise.all(entries.map(async (entry) => {
            const entryPath = path.join(dir, entry.name);
            if (entry.isFile()) {
                return this.readPageSingle(entryPath);
            } else {
                return this.readPages(entryPath);
            }
        }));
    }

    /**
     * Read the Pages for a specific list of files.
     * @param {string[]} files An array file names.
     */
    async readPageFiles(files) {
        await Promise.all(files.map((file) => {
            return this.readPageSingle(file);
        }));
    }

    /**
     * Read a single Page file. If the Page is not already present in the Site, a new Page is created. If it is, then the existing Page is updated.
     * @param {string} filepath The path to the file.
     */
    readPageSingle(filepath) {
        const currentPage = this.site.pageMap[filepath];
        if (currentPage) {
            return currentPage.read();
        } else {
            const page = new Page(this.site, filepath);
            this.site.pageMap[filepath] = page;
            return page.read();
        }
    }
}

module.exports = ReadPagesTask;
