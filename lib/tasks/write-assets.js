const BuildTask = require('../build-task');

/**
 * Writes the processed assets to the build directory.
 */
class WriteAssetsTask extends BuildTask {
    async run() {
        console.log('writing assets');
        console.log(this.site.writableAssets.map(asset => asset.sourcePath));
        await Promise.all(this.site.writableAssets.map(asset => asset.write()));
    }
}

module.exports = WriteAssetsTask;
