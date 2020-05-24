import { Page } from "./page";
const path = require('path');
const fs = require('fs');
const fp = fs.promises;
const matter = require('gray-matter');

/**
 * PROPS
 * markdownToHTML
 *
 * METHODS
 * convert markdown to HTML
 *
 */

class ContentPage extends Page {
    /**
     * Create a new Page.
     * @param {Site} site The Site the page belongs to.
     * @param {string} filepath The path to the file.
     */
    constructor(site, filepath) {
        this.site = site;
        this.filepath = filepath;
        this.parseFilepath(filepath);
    }

    /**
     * Parse the directory, filename, and extension of the Page.
     * @param {string} filepath The path to the file.
     */
    parseFilepath(filepath) {
        this.dirname = path.dirname(filepath);
        this.filename = path.basename(filepath);
        this.extname = path.extension(filepath);
    }

    /**
     * Read the Page file and parse the frontmatter and content.
     */
    readFile() {
        const rawContent = fs.readFileSync(this.filepath);
        const parsedContent = matter(rawContent);
        this.frontmatter = parsedContent.data;
        this.content = parsedContent.content;
    }

}

module.exports = Page;
