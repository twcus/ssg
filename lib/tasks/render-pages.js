/**
 * Renders all of the pages and content into HTML.
 */
const renderPages = function(site) {
    site.content.forEach(page => {
        page.render();
    });
    site.pages.forEach(page => {
        page.render();
    });
};

module.exports = renderPages;
