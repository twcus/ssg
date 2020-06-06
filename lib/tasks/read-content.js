const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const ContentPage = require('../content-page');
const filterFiles = require('../utils/filter-files');

const MAX_DEPTH = 1;

/**
 * Create a ContentPage object for every file in the content directory.
 */
class ReadContentTask extends BuildTask {
    async run() {
        if (this.options.files) {
            return await this.readContentFiles(this.options.files);
        } else {
           return await this.readContent(this.site.config.contentDir);
        }
    }

    /**
     * Read all ContentPages from the given directory.
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
        const entries = filterFiles(await fsp.readdir(dir, { withFileTypes: true }));
        await Promise.all(entries.map(async (entry) => {
            const entryPath = path.join(dir, entry.name);
            if (entry.isFile()) {
                return this.readContentSingle(entryPath);
            } else {
                return this.readContent(entryPath, depth + 1);
            }
        }));
    }

    /**
     * Read the ContentPage for a specific list of files.
     * @param {string[]} files An array file names.
     */
    async readContentFiles(files) {
        await Promise.all(files.map((file) => {
            return this.readContentSingle(file);
        }));
    }

    /**
     * Read a single Content file. If the ContentPage is not already present in the Site, a new ContentPage is created. If it is, then the existing ContentPage is updated.
     * @param {string} filepath The path to the file.
     */
    readContentSingle(filepath) {
        const currentContent = this.site.contentMap[filepath];
        if (currentContent) {
            return currentContent.read();
        } else {
            const contentPage = new ContentPage(this.site, filepath);
            this.site.contentMap[filepath] = contentPage;
            return contentPage.read();
        }
    }
}

module.exports = ReadContentTask;
