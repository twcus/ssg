const path = require('path');
const fs = require('fs');
const fp = fs.promises;
const Handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');

/**
 * The site being built.
 */
class Site {
    /**
     * @param {object} config The site configuration
     */
    constructor(config) {
        const { name, description, url, dataDir } = config;
        Object.assign(this, { name, description, url, dataDir });
        this.config = config;
        this.pages = [];
        this.content = [];
        this.layouts = {};
        this.converter = new MarkdownIt();
        this.renderer = Handlebars;
    }

    get context() {
        return {
            name: this.name,
            description: this.description,
            url: this.url,
            data: this.data
        };
    }
}

module.exports = Site;
