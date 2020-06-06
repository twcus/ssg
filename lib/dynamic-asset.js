const path = require('path');
const fsp = require('fs').promises;
const Asset = require('./asset');
const md5 = require('./utils/md5');

// This is a convoluted mess. Attempting to reference assets in other assets creates a lot of weird dependencies and ordering of operations.
// It's getting hard to follow, and I'm sure there are cases I'm not thinking of that won't be covered.

/**
 * DynamicAssets are HTML, CSS, and Javascript files, which are compilable by Handlebars to utilize Site data (e.g. reference other Assets).
 * They otherwise behave just as other Assets do.
 */
class DynamicAsset extends Asset  {
    /**
     * Create a new DynamicAsset.
     * @param {Site} site The Site the DynamicAsset belongs to.
     * @param {string} filepath The path to the file.
     */
    constructor(site, filepath) {
        super(site, filepath);
        this.isCompiled = false;
    }

    /**
     * Get the template context.
     * @returns {Object} The context object.
     */
    get context() {
        return { site: this.site.attributes }
        return Object.assign({}, this.attributes, { site: this.site.attributes });
    }

    /**
     * Get whether or not the DynamicAsset has been written in its current state yet.
     * @returns {boolean} True if the file has been written since it last changed, false if not.
     */
    get isWritten() {
        return this.site.pathCache.get(this.sourcePath) === this.destPath && this.site.contentCache.get(this.sourcePath) === this.renderedContent;
    }

    /**
     * Read the Asset file.
     */
    async read(encoding) {
        this.template = await super.read(encoding);
        this.isCompiled = false;
    }

    /**
     * Compile the template.
     */
    compile() {
        this.compiledTemplate = this.site.renderer.compile(this.template);
        this.isCompiled = true;
    }

    /**
     * Render the content with the compiled template.
     * TODO The template needs the site context, but the site context needs this asset context, which isn't complete until it has a path property with its
     * revisioned filename. There's a circular dependency that I'm not entirely sure how to work out.
     */
    render() {
        if (!this.isCompiled) {
            this.compile();
        }
        this.renderedContent = this.compiledTemplate(this.context);
    }

    /**
     * Calculate the md5 hash of the file and generate the revisioned DynamicAsset's filename.
     * @returns {string} The filename with the md5 hash appended.
     */
    async revision() {
        console.log('WE ARE THE REVISIONERINER')
        let md5Hash;
        await this.read('utf-8');
        this.render();
        if (this.site.isProduction) {
            this.renderedContent = this.minifier(this.renderedContent);
        }
        md5Hash = md5(this.renderedContent);
        this.revisionedFilename = `${this.sourceName}-${md5Hash}${this.sourceExt}`;
        return this.revisionedFilename;
    }

    /**
     * Write the Asset file to the build directory and delete the stale output file if it exists.
     */
    async write() {
        const destPath = this.destPath;
        const destDir = path.parse(destPath).dir;
        const cachedDestPath = this.site.pathCache.get(this.sourcePath);
        try {
            await fsp.mkdir(destDir, { recursive: true });
            await fsp.writeFile(destPath, this.renderedContent);
            if (cachedDestPath && cachedDestPath !== destPath) {
                await fsp.unlink(cachedDestPath);
            }
            this.site.contentCache.set(this.sourcePath, this.renderedContent);
            this.site.pathCache.set(this.sourcePath, this.destPath);
        } catch (err) {
            console.log(err);
        }
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

module.exports = DynamicAsset;
