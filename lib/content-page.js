const Page = require('./page');

/**
 * ContentPages are pages that represent the items in the content directory, written in markdown.
 */
class ContentPage extends Page {
    /**
     * Create a new ContentPage.
     * @param {Site} site The Site the page belongs to.
     * @param {string} filepath The path to the file.
     */
    constructor(site, filepath) {
        super(site, filepath);
        this.convert();
        this.body = this.layout();
        this.context.content = this.content;
    }

    /**
     * Determine the layout to use for this content, as specified in the frontmatter.
     * If no layout is specified, the converted HTML will be output as is.
     * @returns {string} The output filepath.
     */
    layout() {
        return this.frontmatter.layout ? this.site.layouts[this.frontmatter.layout].content : this.content;
    }

    /**
     * Convert the markdown content to HTML.
     */
    convert() {
        this.content = this.site.converter.render(this.body);
    }
}

module.exports = ContentPage;
