const path = require('path');
const tasks = require('../tasks');

/**
 * Update the partial that has changed, then render pages and write any that have changed.
 */
const build = async (filepath, site) => {
    const options = { files: [path.parse(filepath).base] };
    const taskGroups = [
        [
            new tasks.ReadLayoutsTask(site, options)
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
 * Watches for changes in the layouts directory.
 */
const addWatcher = function(chokidar, watcherOptions, site) {
    const layoutWatcher = chokidar.watch(site.config.layoutsDir, Object.assign({ depth: 0 }, watcherOptions));
    layoutWatcher
        .on('add', async (filepath) => {
            await build(filepath, site);
        })
        .on('change', async (filepath) => {
            await build(filepath, site);
        })
        .on('unlink', async (filepath) => {
            // On deletion, delete the layout, then render pages and write any that have changed.
            site.deleteLayout(path.parse(filepath).base);
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
