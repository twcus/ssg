const path = require('path');
const fsp = require('fs').promises;
const md5File = require('md5-file');
const md5 = require('./utils/md5');
const minify = require('./utils/minify');
const { MINIFIABLE_EXTS } = require('./utils/constants');

/**
 * Assets are static files that are optimized and revisioned, and accessible via the site's asset hash.
 * Assets maintain their original directory structure under the assets directory, and each filename is appended with its md5 hash.
 */
class Asset {
    /**
     * Create a new Asset.
     * @param {Site} site The Site the Asset belongs to.
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
        return path.join('/', this.sourceDir, this.revisionedFilename);
    }

    /**
     * Get the destination path for the output file.
     * @returns {string} The filepath of the output asset file.
     */
    get destPath() {
        return path.join(this.site.config.buildDir, this.sourceDir, this.revisionedFilename);
    }

    /**
     * Get whether or not the Asset has been written in its current state yet.
     * @returns {boolean} True if the file has been written since it last changed, false if not.
     */
    get isWritten() {
        return this.site.pathCache.get(this.sourcePath) === this.destPath;
    }

    /**
     * Get whether ot not the Asset is able to be minified.
     * @returns {boolean} True if the Asset can be minified, false if not.
     */
    get isMinifiable() {
        return MINIFIABLE_EXTS.includes(this.sourceExt);
    }

    /**
     * Get the minify function for this CompilableAsset's file type.
     * @returns {function} The minify function.
     */
    get minifier() {
        return minify.extensionMap[this.sourceExt];
    }

    /**
     * Calculate the md5 hash of the file and generate the revisioned Asset's filename.
     * @returns {string} The filename with the md5 hash appended.
     */
    async revision() {
        let md5Hash;
        if (this.site.isProduction && this.isMinifiable) {
            const content = await this.read('utf-8');
            this.minifiedContent = await this.minifier(content);
            md5Hash = md5(this.minifiedContent);
        } else {
            md5Hash = await md5File(this.sourcePath);
        }
        this.revisionedFilename = `${this.sourceName}-${md5Hash}${this.sourceExt}`;
        return this.revisionedFilename;
    }

    /**
     * Read the Asset file.
     */
    async read(encoding) {
        return await fsp.readFile(this.sourcePath, encoding);
    }

    /**
     * Write the Asset file to the build directory and delete the stale output file if it exists.
     */
    async write() {
        const destPath = this.destPath;
        const destDir = path.parse(destPath).dir;
        const cachedDestPath = this.site.pathCache.get(this.sourcePath);
        await fsp.mkdir(destDir, { recursive: true });
        if (this.minifiedContent) {
            await fsp.writeFile(destPath, this.minifiedContent);
        } else {
            await fsp.copyFile(this.sourcePath, destPath);
        }
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