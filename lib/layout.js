const fsp = require('fs').promises;
const matter = require('gray-matter');

/**
 * Pages are derived from a source file, and will be output to a resulting HTML file after being processed.
 */
class Layout {
    /**
     * Create a new Page.
     * @param {Site} site The Site the page belongs to.
     * @param {string} filepath The path to the file.
     */
    constructor(site, filepath) {
        this.site = site;
        this.filepath = filepath;
    }

    /**
     * Read the Page file and parse the frontmatter and content.
     */
    async read() {
        const rawContent = await fsp.readFile(this.filepath);
        const parsedContent = matter(rawContent);
        this.frontmatter = parsedContent.data;
        this.content = parsedContent.content;
    }
}

module.exports = Layout;
