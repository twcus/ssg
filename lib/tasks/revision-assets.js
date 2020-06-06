const fsp = require('fs').promises;
const path = require('path');
const BuildTask = require('../build-task');
const Asset = require('../asset');
const DynamicAsset = require('../dynamic-asset');
const filterFiles = require('../utils/filterFiles');
const { HTML_EXT, CSS_EXT, JS_EXT } = require('../utils/constants');

/**
 * Revision assets by appending their md5 hash to their filenames.
 */
class RevisionAssetsTask extends BuildTask {
    async run() {
        console.log('revisioning assets');
        if (this.options.files) {
            return await this.revisionAssetFiles(this.options.files);
        } else {
            // There has to be an order in which assets are processed, because some could depend on others (e.g. using a background-image in CSS).
            await this.revisionAssets(this.site.config.assetsDir);
            const dynamicAssets = this.site.dynamicAssets;
            const htmlAssets = dynamicAssets.filter(asset => asset.sourceExt === HTML_EXT);
            const cssAssets = dynamicAssets.filter(asset => asset.sourceExt === CSS_EXT);
            const jsAssets = dynamicAssets.filter(asset => asset.sourceExt === JS_EXT);
            console.log(cssAssets[0].revision.toString());
            await Promise.all(cssAssets.map(asset => asset.revision()));
            await Promise.all(jsAssets.map(asset => asset.revision()));
            await Promise.all(htmlAssets.map(asset => asset.revision()));
        }
    }

    /**
     * Creates Assets for all files in the given directory, maintaining the directory structure.
     * @param {string} dir The directory of files to read assets from.
     */
    async revisionAssets(dir) {
        let entries = filterFiles(await fsp.readdir(dir, { withFileTypes: true }));
        await Promise.all(entries.map(async (entry) => {
            const entryPath = path.join(dir, entry.name);
            const currentAsset = this.site.assetMap[entryPath];
            if (currentAsset) {
                return currentAsset.revision();
            } else if (entry.isFile()) {
                let asset;
                if (this.site.dynamicAssetPaths.includes(entryPath)) {
                    asset = new DynamicAsset(this.site, entryPath);
                } else {
                    // Go ahead and revision any non-dynamic Assets.
                    asset = new Asset(this.site, entryPath);
                    await asset.revision();
                }
                this.site.assetMap[entryPath] = asset;
                return asset;
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
            const asset = this.site.dynamicAssetPaths.includes(filepath) ? new DynamicAsset(this.site, filepath) : new Asset(this.site, filepath);
            this.site.assetMap[filepath] = asset;
            return asset.revision();
        }
    }


    /**
     * Asset types
     * 1. Plain static assets (e.g. images) - just revise and write them
     * 2. Minifiable assets (e.g. HTML, CSS, JS) - read them, minify them (if prod), revise them, write them
     * 3. Templated assets (e.g. assets that reference other assets/site data) - read them, compile them, render them, minify them (if prod), revise them, write them
     */

    /**
     * 1. Read assets
     * 2. Compile
     * 3. Render
     * 4. Minify
     * 5. Write
     */
}

module.exports = RevisionAssetsTask;
