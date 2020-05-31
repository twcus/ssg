const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const Asset = require('../asset');

/**
 * Revision assets by appending their md5 hash to their filenames.
 */
class RevisionAssetsTask extends BuildTask {
    async run() {
        await this.revisionAssets(this.site.config.assetsDir);
    }

    /**
     * Creates Assets and calculates their md5 hash for all files in the assets directory, maintaining the directory structure.
     * @param {string} dir The directory of files to read assets from.
     */
    async revisionAssets(dir) {
        const entries = await fsp.readdir(dir, { withFileTypes: true });
        await Promise.all(entries.map(async (entry) => {
            const entryPath = path.join(dir, entry.name);
            if (entry.isFile()) {
                const asset = new Asset(this.site, entryPath);
                this.site.assetMap[entryPath] = asset;
                return asset.calcMd5();
            } else {
                return this.revisionAssets(entryPath);
            }
        }));
    }
}

module.exports = RevisionAssetsTask;
