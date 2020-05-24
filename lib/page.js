const path = require('path');
const fs = require('fs');
const fp = fs.promises;
const matter = require('gray-matter');

/**
 * Pages are derived from a source file, and will be output to a resulting HTML file after being processed.
 */
class Page {
    /**
     * Create a new Page.
     * @param {Site} site The Site the page belongs to.
     * @param {string} filepath The path to the file.
     */
    constructor(site, filepath) {
        this.site = site;
        this.filepath = filepath;
        this.parseFilepath(filepath);
        this.readFile();
    }

    /**
     * Parse the directory, filename, and extension of the Page.
     * @param {string} filepath The path to the file.
     */
    parseFilepath(filepath) {
        this.dirname = path.dirname(filepath);
        this.filename = path.basename(filepath);
        this.extname = path.extname(filepath);
    }

    /**
     * Determine the output filepath. The resulting file will always been an index.html file in the dir
     * path derived from the content dir or as specified in the frontmatter.
     * @returns {string} The output filepath.
     */
    outputDir() {
        const outputFile = 'index.html';
        const buildDir = this.site.config.buildDir;
        const permalink = this.frontmatter.permalink;
        const  outputDir = permalink ? permalink : path.join(this.dirname, this.filename);
        return path.join(buildDir, outputDir, outputFile);
    }

    /**
     * Read the Page file and parse the frontmatter and content.
     */
    readFile() {
        console.log(this.filepath);
        const rawContent = fs.readFileSync(this.filepath);
        const parsedContent = matter(rawContent);
        this.rawContent = rawContent;
        this.frontmatter = parsedContent.data;
        this.body = parsedContent.content;
        this.context = { site: this.site, page: this.frontmatter};
    }

    render() {
        const template = this.site.renderer.compile(this.body);
        this.renderedContent = template(this.context);
    }

    writeFile() {
        const outputFile = this.outputDir();
        const outputDir = path.parse(outputFile).dir;
        fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(outputFile, this.renderedContent);
    }
}

module.exports = Page;
