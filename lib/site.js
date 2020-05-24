const path = require('path');
const fs = require('fs');
const fp = fs.promises;

/**
 * The site being built.
 */
class Site {
    /**
     * @param {object} config The site configuration
     */
    constructor(config) {
        const { name, description, url, dataDir } = config;
        Object.assign(this, { name, description, url, dataDir });
        this.pages = [];
        this.data = this.loadData();
    }

    /**
     * Parses all the data in the specified data directory into an object that maintains the dir structure.
     * @returns {Object} The parsed data.
     * TODO make this recursive
     */
    loadData() {
        console.log('loading data');
        const dataPath = this.dataDir;
        const allData = {};
        try {
            let files = fs.readdirSync(dataPath);
            console.log(files);
            files.forEach(f => {
                const dataName = path.parse(f).name;
                allData[dataName] = require(path.resolve(dataPath, f));
            });
        } catch(err) {
            console.log(err);
        }
        return allData;
    }
}

module.exports = Site;
