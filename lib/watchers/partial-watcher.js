const path = require('path');
const tasks = require('../tasks');

/**
 * Register the partial that has changed, then render pages and write any that have changed.
 */
const build = async (filepath, site) => {
    const options = { files: [path.parse(filepath).base] };
    const taskGroups = [
        [
            new tasks.RegisterPartialsTask(site, options)
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
 * Watches for changes in the partials directory.
 */
const addWatcher = function(chokidar, watcherOptions, site) {
    const partialWatcher = chokidar.watch(site.config.partialsDir, Object.assign({ depth: 0 }, watcherOptions));
    partialWatcher
        .on('add', async (filepath) => {
            await build(filepath, site);
        })
        .on('change', async (filepath) => {
            await build(filepath, site);
        })
        .on('unlink', async (filepath) => {
            // On deletion, unregister the partial, then render pages and write any that have changed.
            site.unregisterPartial(path.parse(filepath).base);
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
