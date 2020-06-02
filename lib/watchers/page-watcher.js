const tasks = require('../tasks');

/**
 * Update the partial that has changed, then render pages and write any that have changed.
 */
const build = async (filepath, site) => {
    const options = { files: [filepath] };
    const taskGroups = [
        [
            new tasks.ReadPagesTask(site, options)
        ],
        [
            new tasks.RenderPagesTask(site)
        ],
        [
            new tasks.WritePagesTask(site)
        ]
    ];
    await site.build(taskGroups);
};

/**
 * Watches for changes in the pages directory.
 */
const addWatcher = function(chokidar, watcherOptions, site) {
    const pageWatcher = chokidar.watch(site.config.pagesDir, watcherOptions);
    pageWatcher
        .on('add', async (filepath) => {
            await build(filepath, site);
        })
        .on('change', async (filepath) => {
            await build(filepath, site);
        })
        .on('unlink', async (filepath) => {
            // On deletion, delete the page, then render pages and write any that have changed.
            await site.deletePage(filepath);
            const taskGroups = [
                [
                    new tasks.RenderPagesTask(site)
                ],
                [
                    new tasks.WritePagesTask(site)
                ]
            ];
            await site.build(taskGroups);
        });
};

module.exports = {
    addWatcher
};
