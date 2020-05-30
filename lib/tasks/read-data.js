const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');

/**
 * Load the Site data from the data directory.
 */
class ReadDataTask extends BuildTask {
    async run() {
        const data = await this.readData(this.site.config.dataDir);
        Object.assign(this.site.data, data.data);
    }

    /**
     * Parses all data in the Site's data directory into an object that maintains the dir structure with dot notation.
     * @param {string} dir The directory of files to read data from.
     * @returns {Object} The data object for the directory.
     */
    async readData(dir) {
        const result = {};
        const entries = await fsp.readdir(dir, { withFileTypes: true });
        let resultData = await Promise.all(entries.map(async (entry) => {
            const key = path.parse(entry.name).name;
            const entryPath = path.resolve(dir, entry.name);
            if (entry.isFile()) {
                const fileData = {};
                const fileContent = await fsp.readFile(entryPath);
                fileData[key] = JSON.parse(fileContent);
                return fileData;
            } else {
                return this.readData(entryPath);
            }
        }));
        const [dirname] = dir.split(path.sep).slice(-1);
        // This is not a deep merge, so it is possible for data from one file to completely overwrite that of another.
        // It is up to the user to structure the data in such a way that this doesn't happen. Need to think on this....
        result[dirname] = Object.assign({}, ...resultData);
        return result;
    }
}

module.exports = ReadDataTask;
