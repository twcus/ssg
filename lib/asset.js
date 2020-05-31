const path = require('path');
const fsp = require('fs').promises;
const md5File = require('md5-file');

/**
 * Assets are static files are optimized and calcMd5ed, and accessible via the site's asset hash.
 * Assets maintain their original directory structure under the assets directory, and each filename is appended with its md5 sum.
 */
class Asset {
    /**
     * Create a new Asset.
     * @param {Site} site The Site the asset belongs to.
     * @param {string} filepath The path to the file.
     */
    constructor(site, filepath) {
        this.site = site;
        this.filepath = filepath;
        const { dir: sourceDir, name: sourceName, ext: sourceExt } = path.parse(filepath);
        Object.assign(this, { sourceDir, sourceName, sourceExt });
    }

    /**
     * Get a hash of attributes that will be made available to the Site's template context.
     * @returns {Object} The hash of attributes.
     */
    get attributes() {
        return {
            name: `${this.sourceName}${this.sourceExt}`,
            path: this.path,
        };
    }

    /**
     * Get the URL path of the Asset.
     * @returns {string} The path.
     */
    get path() {
        return path.join('/', this.sourceDir, this.revisedFilename);
    }

    /**
     * Get the destination path for the output file.
     * @returns {string} The filepath of the output asset file.
     */
    get destPath() {
        return path.join(this.site.config.buildDir, this.sourceDir, this.revisedFilename);
    }

    /**
     * Calculate the md5 hashed filename.
     * @returns {string} The filename with the md5 hash appended.
     */
    async calcMd5() {
        const md5 = await md5File(this.filepath);
        this.revisedFilename = `${this.sourceName}-${md5}${this.sourceExt}`;
        return this.revisedFilename;
    }

    /**
     * Write the Asset file to the build directory.
     */
    async write() {
        const outputPath = this.destPath;
        const outputDir = path.parse(outputPath).dir;
        await fsp.mkdir(outputDir, { recursive: true });
        await fsp.copyFile(this.filepath, outputPath);
    }
}

module.exports = Asset;
