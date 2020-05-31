const Handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');
const mapBy = require('./utils/mapBy');

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
        this.layoutMap = {};
        this.assetMap = {};
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
            assets: this.assetAttrMap,
            pages: mapBy(this.pages, 'attributes'),
            content: mapBy(this.content, 'attributes'),
            categories: this.categoryMap
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
     * Get all content categories for this Site.
     * @returns {string[]} An array of content categories.
     */
    get categories() {
        return Array.from(new Set(this.content.map(content => content.category)));
    }

    /**
     * Get a map of categories, mapping category name to an array of content attribute objects in that category.
     * @returns {Object} The map of categories to their content.
     */
    get categoryMap() {
        return this.categories.reduce((acc, category) => {
            acc[category] = mapBy(this.content.filter(content => content.category === category), 'attributes');
            return acc;
        }, {});
    }

    /**
     * Get a map of Assets, mapping Asset paths to their respective Asset's attributes.
     * @returns {Object} The map Asset attributes.
     */
    get assetAttrMap() {
        return Object.entries(this.assetMap).reduce((acc, [key, value]) => {
            acc[key] = value.attributes;
            return acc;
        }, {});
    }

    /**
     * Get an array of all Assets for this Site.
     * @returns {Object[]} An array of Assets.
     */
    get assets() {
        return Object.values(this.assetMap);
    }

    /**
     * Unregister a helper from Handlebars.
     * @param {string} helperName The name of the helper.
     */
    unregisterHelper(helperName) {
        this.renderer.unregisterHelper(helperName);
    }

    /**
     * Unregister a partial from Handlebars.
     * @param {string} partialName The name of the partial.
     */
    unregisterPartial(partialName) {
        this.renderer.unregisterPartial(partialName);
    }
}

module.exports = Site;
