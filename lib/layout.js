const fs = require('fs');
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
        this.readFile();
    }

    /**
     * Read the Page file and parse the frontmatter and content.
     */
    readFile() {
        const rawContent = fs.readFileSync(this.filepath);
        const parsedContent = matter(rawContent);
        this.rawContent = rawContent;
        this.frontmatter = parsedContent.data;
        this.content = parsedContent.content;
    }
}

module.exports = Layout;
