const Page = require('./page');
const path = require('path');
const { INDEX_FILENAME } = require('./utils/constants');

/**
 * ContentPages are pages that represent the items in the content directory, written in markdown.
 */
class ContentPage extends Page {
    /**
     * Get the content's category.
     * @returns {string} The category of this Content Page.
     */
    get category() {
        const categoryDir = this.sourceDir.split(path.sep).slice(1)[0];
        return categoryDir ? categoryDir : this.site.config.uncategorizedContentName;
    }

    /**
     * Get a hash of attributes that will be made available to this Content's template (content.{attr}).
     * @returns {Object} The hash of attributes.
     */
    get attributes() {
        // TODO Need to throw warning if user defines an html property in the frontmatter (or any other potential reserved properties)
        return Object.assign(super.attributes, { html: this.convertedContent, category: this.category });
    }

    /**
     * Get the template context.
     * @returns {Object} The context object.
     */
    get context() {
        return {
            site: this.site.attributes,
            content: this.attributes
        };
    }

    /**
     * Get the destination path for the output file.
     * @returns {string} The filepath of the output .html file.
     */
    get destPath() {
        const buildDir = this.site.config.buildDir;
        const categoryDir = this.category === this.site.config.uncategorizedContentName ? '' : this.category;
        const url = this.frontmatter.url;
        let destPath;
        if (url) {
            destPath = path.join(buildDir, url, INDEX_FILENAME);
        } else {
            destPath = path.join(buildDir, categoryDir, this.sourceName, INDEX_FILENAME);
        }
        return destPath;
    }

    /**
     * Get the layout name for this ContentPage if a layout was specified. Otherwise, returns null.
     * @returns {string} The layout name.
     */
    get layoutName() {
        return this.frontmatter.layout || this.site.config.content[this.category].layout || null;
    }

    /**
     * Get the template to use for this content, which is the layout specified in the frontmatter.
     * If no layout is specified, the converted HTML will be output as is.
     * @returns {string} The template.
     */
    get template() {
        return this.frontmatter.layout ? this.site.layoutMap[this.frontmatter.layout].content : this.convertedContent;
    }

    /**
     * Read the Page file and parse the frontmatter and content.
     */
    async read() {
        await super.read();
        this.convert();
    }

    /**s
     * Convert the markdown content to HTML.
     */
    convert() {
        this.content = this.rawContent;
        this.convertedContent = this.site.converter.render(this.content);
    }
}

module.exports = ContentPage;
