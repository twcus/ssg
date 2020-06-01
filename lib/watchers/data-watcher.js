const tasks = require('../tasks');

/**
 * Reload all data, then render pages and write any that changed.
 * TODO Only reload data that has changed. This gets messy, so for now reloading all data.
 */
const build = async (site) => {
    const taskGroups = [
        [
            new tasks.ReadDataTask(site)
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
 * Watches for changes in the data directory.
 */
const addWatcher = function(chokidar, watcherOptions, site) {
    const dataWatcher = chokidar.watch(site.config.dataDir, watcherOptions);
    dataWatcher
        .on('all', async () => {
            await build(site);
        });
};

module.exports = {
    addWatcher
};
