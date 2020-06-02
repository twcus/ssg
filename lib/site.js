const Handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');
const NodeCache = require('node-cache');
const tasks = require('./tasks');
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
        this.contentMap = {};
        this.pageMap = {};
        this.layoutMap = {};
        this.assetMap = {};
        this.converter = new MarkdownIt();
        this.renderer = Handlebars;
        this.cache = new NodeCache();
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
     * Get a list of Pages for this Site.
     * @returns {Object[]} An array of Pages.
     */
    get pages() {
        return Object.values(this.pageMap);
    }

    /**
     * Get a list of ContentPages for this Site.
     * @returns {Object[]} An array of ContentPages.
     */
    get content() {
        return Object.values(this.contentMap);
    }

    /**
     * Get all Pages and ContentPages for this Site.
     * @returns {Object[]} An array of Pages and ContentPages.
     */
    get allPages() {
        return [...this.pages, ...this.content];
    }

    /**
     * Get all Pages and ContentPages that need to be written.
     * @returns {Object[]} An array of Pages and ContentPages.
     */
    get writablePages() {
        return this.allPages.filter(page => page.shouldWrite);
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
     * Get an array of Assets that have stale files.
     * @returns {Object[]} An array of Assets.
     */
    get staleAssets() {
        return Object.values(this.assetMap).filter(asset => asset.stalepath);
    }

    /**
     * Register a helper from Handlebars.
     * @param {string} helperName The name of the helper.
     * @param {fn} helper The helper function.
     */
    registerHelper(helperName, helper) {
        this.renderer.registerHelper(helperName, helper);
    }

    /**
     * Register a partial from Handlebars.
     * @param {string} partialName The name of the partial.
     * @param {string} partial The partial content.
     */
    registerPartial(partialName, partial) {
        this.renderer.registerPartial(partialName, partial);
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

    /**
     * Delete a Layout from the Site.
     * @param {string} layoutName The name of the Layout.
     */
    deleteLayout(layoutName) {
        delete this.layoutMap[layoutName];
    }

    /**
     * Delete a Page from the Site.
     * @param {string} pagePath The filepath of the Page.
     */
    async deletePage(pagePath) {
        try {
            const page = this.pageMap[pagePath];
            await page.delete();
            delete this.pageMap[pagePath];
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Delete a ContentPage from the Site.
     * @param {string} contentPath The filepath of the ContentPage.
     */
    async deleteContent(contentPath) {
        try {
            const content = this.contentMap[contentPath];
            await content.delete();
            delete this.contentMap[contentPath];
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Delete an Asset from the Site.
     * @param {string} assetPath The filepath of the Asset.
     */
    async deleteAsset(assetPath) {
        try {
            const asset = this.assetMap[assetPath];
            await asset.delete();
            delete this.assetMap[assetPath];
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Get the full list of BuildTask groups for a complete Site build.
     * @returns An array of arrays of BuildTasks. Each inner array are tasks that can run in parallel.
     */
    get taskGroups() {
        const taskGroups = [
            [
                new tasks.RegisterHelpersTask(this),
                new tasks.RegisterPartialsTask(this),
                new tasks.ReadDataTask(this),
                new tasks.ReadLayoutsTask(this)
            ],
            [
                new tasks.ReadPagesTask(this),
                new tasks.ReadContentTask(this),
                new tasks.RevisionAssetsTask(this)
            ],
            [
                new tasks.RenderPagesTask(this)
            ],
            [
                new tasks.WritePagesTask(this),
                new tasks.WriteAssetsTask(this)
            ]
        ];
        if (this.isProduction) {
            // TODO Must add production-specific task(s) to taskGroups
        }
        return taskGroups;
    }

    /**
     * Build the Site by running the specified BuildTasks. If no tasks are provided, the full build process will run.
     * @param {BuildTask[][]} taskGroups An array of arrays of BuildTasks. Each inner array are tasks that can be run in parallel.
     */
    async build(taskGroups= this.taskGroups) {
        for (const taskGroup of taskGroups) {
            await Promise.all(taskGroup.map(task => task.run()));
        }
    }
}

module.exports = Site;
