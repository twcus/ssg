const tasks = require('../tasks');

/**
 * Update the partial that has changed, then render pages and write any that have changed.
 */
const build = async (filepath, site) => {
    const options = { files: [filepath] };
    const taskGroups = [
        [
            new tasks.ReadContentTask(site, options)
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
 * Watches for changes in the contents directory.
 */
const addWatcher = function(chokidar, watcherOptions, site) {
    const contentWatcher = chokidar.watch(site.config.contentDir, Object.assign({ depth: 1 }, watcherOptions));
    contentWatcher
        .on('add', async (filepath) => {
            await build(filepath, site);
        })
        .on('change', async (filepath) => {
            await build(filepath, site);
        })
        .on('unlink', async (filepath) => {
            // On deletion, delete the content, then render pages and write any that have changed.
            await site.deleteContent(filepath);
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
