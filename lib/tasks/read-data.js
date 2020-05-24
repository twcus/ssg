const fs = require('fs');
const path = require('path');

/**
 * Parses all the data in the specified data directory into an object that maintains the dir structure.
 * @returns {Object} The parsed data.
 * TODO allow for nested data dirs, only update data from files that changed
 */
const loadData = function(site) {
    console.log('loading data');
    const dataPath = site.config.dataDir;
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
    site.data = allData;
    return allData;
};

module.exports = loadData;
