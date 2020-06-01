const BuildTask = require('../build-task');

/**
 * Renders all of the pages and content into HTML.
 */
class RenderPagesTask extends BuildTask {
    run() {
        console.log('rendering pages');
        const writablePages = [];
        this.site.allPages.forEach(page => {
            const cachedPageContent = this.site.cache.get(page.sourcePath);
            if (!page.isCompiled) {
                page.compile();
            }
            page.render();
            if (page.renderedContent !== cachedPageContent) {
                this.site.cache.set(page.sourcePath, page.renderedContent);
                writablePages.push(page);
            }
        });
        this.site.writablePages = writablePages;
    }
}

module.exports = RenderPagesTask;
