const BuildTask = require('../build-task');

/**
 * Writes the processed assets to the build directory.
 */
class WriteAssetsTask extends BuildTask {
    async run() {
        await Promise.all(this.site.allAssets.map(asset => asset.write()));
    }
}

module.exports = WriteAssetsTask;
