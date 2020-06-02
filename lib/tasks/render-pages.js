const BuildTask = require('../build-task');

/**
 * Renders all of the pages and content into HTML.
 */
class RenderPagesTask extends BuildTask {
    run() {
        console.log('rendering pages');
        this.site.allPages.forEach(page => page.render());
    }
}

module.exports = RenderPagesTask;
