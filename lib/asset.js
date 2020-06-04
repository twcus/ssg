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
        this.sourcePath = filepath;
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
     * Get whether or not the Asset has been written in its current state yet.
     * @returns {boolean} True if the file has been written since it last changed, false if not.
     */
    get isWritten() {
        return this.site.pathCache.get(this.sourcePath) === this.destPath;
    }

    /**
     * Calculate the md5 hashed filename and generate the revisioned Asset's filename.
     * @returns {string} The filename with the md5 hash appended.
     */
    async revision() {
        const md5 = await md5File(this.sourcePath);
        this.revisedFilename = `${this.sourceName}-${md5}${this.sourceExt}`;
        return this.revisedFilename;
    }

    /**
     * Write the Asset file to the build directory and delete the stale output file if it exists.
     */
    async write() {
        const destPath = this.destPath;
        const destDir = path.parse(destPath).dir;
        const cachedDestPath = this.site.pathCache.get(this.sourcePath);
        await fsp.mkdir(destDir, { recursive: true });
        await fsp.copyFile(this.sourcePath, destPath);
        if (cachedDestPath && !this.isWritten) {
            await fsp.unlink(cachedDestPath);
        }
        this.site.pathCache.set(this.sourcePath, this.destPath);
    }

    /**
     * Delete the Asset's output file.
     */
    async delete() {
        try {
            return await fsp.unlink(this.destPath);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Asset;
