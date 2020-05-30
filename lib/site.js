const Handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');

/**
 * The site being built.
 */
class Site {
    /**
     * @param {Object} config The site configuration
     */
    constructor(config) {
        const { name, description, url } = config;
        Object.assign(this, { name, description, url });
        this.config = config;
        this.data = {};
        this.pages = [];
        this.content = [];
        this.layouts = {};
        this.assets = {};
        this.converter = new MarkdownIt();
        this.renderer = Handlebars;
    }

    /**
     * Get a hash of attributes that will be made available to this Site's templates (site.{attr}).
     * @returns {Object} The hash of attributes.
     */
    get attributes() {
        return {
            name: this.name,
            description: this.description,
            url: this.url,
            data: this.data,
            assets: this.assets,
            pages: this.pages,
            content: this.content
        };
    }

    /**
     * Get all Pages and ContentPages for this Site.
     * @returns {Object[]} An array of Pages and ContentPages.
     */
    get allPages() {
        return [...this.pages, ...this.content];
    }

    /**
     * Get an array of all Assets for this Site.
     * @returns {Object[]} An array of Assets.
     */
    get allAssets() {
        return Object.values(this.assets);
    }
}

module.exports = Site;
