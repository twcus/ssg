const path = require('path');
const fsp = require('fs').promises;
const matter = require('gray-matter');
const { INDEX_FILENAME } = require('./utils/constants');

/**
 * Pages are derived from a source file, and will be output to a resulting HTML file after being processed.
 */
class Page {
    /**
     * Create a new Page.
     * @param {Site} site The Site the page belongs to.
     * @param {string} filepath The path to the source file.
     */
    constructor(site, filepath) {
        this.site = site;
        this.sourcePath = filepath;
        this.isCompiled = false;
        this.shouldWrite = true;
        const { dir: sourceDir, name: sourceName, ext: sourceExt } = path.parse(filepath);
        Object.assign(this, { sourceDir, sourceName, sourceExt });
    }

     /**
     * Get a hash of attributes that will be made available to this Page's template (page.{attr}).
     * @returns {Object} The hash of attributes.
     */
    get attributes() {
        return Object.assign({}, this.frontmatter, { url: this.url });
    }

    /**
     * Get the template context.
     * @returns {Object} The context object.
     */
    get context() {
        return {
            site: this.site.attributes,
            page: this.attributes
        };
    }

    /**
     * Get the URL for this Page.
     * @returns {string} The url.
     */
    get url() {
        return path.join('/', ...path.parse(this.destPath).dir.split(path.sep).slice(1));
    }

    /**
     * Get the destination path for the output file.
     * @returns {string} The filepath of the output .html file.
     */
    get destPath() {
        const buildDir = this.site.config.buildDir;
        const isIndex = this.sourceName === path.parse(INDEX_FILENAME).name;
        let strippedSourceDir = this.sourceDir.split(path.sep).slice(1);
        const url = this.frontmatter.url;
        let destPath;
        if (url) {
            destPath = path.join(buildDir, url, INDEX_FILENAME);
        } else if (isIndex) {
            destPath = path.join(buildDir, ...strippedSourceDir, INDEX_FILENAME);
        } else {
            destPath = path.join(buildDir, ...strippedSourceDir, this.sourceName, INDEX_FILENAME);
        }
        return destPath;
    }

    /**
     * Read the Page file and parse the frontmatter and content.
     */
    async read() {
        const rawContent = await fsp.readFile(this.sourcePath);
        const parsedContent = matter(rawContent);
        this.isCompiled = false;
        this.frontmatter = parsedContent.data;
        this.rawContent = parsedContent.content;
    }

    /**
     * Get the template to use for this Page.
     * @returns {string} The template.
     */
    get template() {
        return this.rawContent;
    }

    /**
     * Compile the template.
     */
    compile() {
        this.compiledTemplate = this.site.renderer.compile(this.template);
        this.isCompiled = true;
    }

    /**
     * Render the HTML content with the compiled template.
     */
    render() {
        const cachedPageContent = this.site.cache.get(this.sourcePath);
        if (!this.isCompiled) {
            this.compile();
        }
        this.renderedContent = this.compiledTemplate(this.context);
        if (this.renderedContent !== cachedPageContent) {
            console.log('here');
            this.site.cache.set(this.sourcePath, this.renderedContent);
            this.shouldWrite = true;
        }
    }

    /**
     * Write the resulting HTML Page file to the build directory.
     */
    async write() {
        const destPath = this.destPath;
        const destDir = path.parse(destPath).dir;
        try {
            await fsp.mkdir(destDir, { recursive: true });
            await fsp.writeFile(destPath, this.renderedContent);
            this.shouldWrite = false;
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Delete the Page's HTML output file.
     */
    async delete() {
        try {
            return await fsp.unlink(this.destPath);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Page;
