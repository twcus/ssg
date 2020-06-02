const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const Asset = require('../asset');

/**
 * Revision assets by appending their md5 hash to their filenames.
 */
class RevisionAssetsTask extends BuildTask {
    async run() {
        console.log('revisioning assets');
        if (this.options.files) {
            return await this.revisionAssetFiles(this.options.files);
        } else {
            return await this.revisionAssets(this.site.config.assetsDir);
        }
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
                return asset.revision();
            } else {
                return this.revisionAssets(entryPath);
            }
        }));
    }

    /**
     * Revision a specific list of Asset files.
     * @param {string[]} files An array file names.
     */
    async revisionAssetFiles(files) {
        await Promise.all(files.map((file) => {
            return this.revisionAssetSingle(file);
        }));
    }

    /**
     * Revision a single Asset file. If the Asset is not already present in the Site, a new Asset is created. If it is, then the existing Asset is updated.
     * @param {string} filepath The path to the file.
     */
    revisionAssetSingle(filepath) {
        const currentAsset = this.site.assetMap[filepath];
        if (currentAsset) {
            return currentAsset.revision();
        } else {
            const page = new Asset(this.site, filepath);
            this.site.assetMap[filepath] = page;
            return page.revision();
        }
    }
}

module.exports = RevisionAssetsTask;
