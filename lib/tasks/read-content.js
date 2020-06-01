const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const ContentPage = require('../content-page');

const MAX_DEPTH = 1;

/**
 * Create a ContentPage object for every file in the content directory.
 */
class ReadContentTask extends BuildTask {
    async run() {
        await this.readContent(this.site.config.contentDir);
    }

    /**
     * Creates ContentPages for all files in the content directory up to a depth of 1 level deep.
     * @param {string} dir The directory of files to read content from.
     * @param {int} depth The current directory depth.
     */
    async readContent(dir, depth = 0) {
        // For simplicity, keeping content restricted to a depth of 1. Top-level subdirectories in the content directory are treated as
        // categories, any directories further down are ignored. Would like to expand on this in the future to allow for any directory
        // structure no matter how deep, but it complicates how content is handled in the site. TODO Need to think on it.
        if (depth > MAX_DEPTH) {
            return;
        }
        const entries = await fsp.readdir(dir, { withFileTypes: true });
        await Promise.all(entries.map(async (entry) => {
            const entryPath = path.join(dir, entry.name);
            if (entry.isFile()) {
                const contentPage = new ContentPage(this.site, entryPath);
                this.site.content.push(contentPage);
                return contentPage.read();
            } else {
                return this.readContent(entryPath, depth + 1);
            }
        }));
    }
}

module.exports = ReadContentTask;
