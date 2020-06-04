const tasks = require('../tasks');

/**
 * Update the partial that has changed, then render pages and write any that have changed.
 */
const build = async (filepath, site) => {
    const options = { files: [filepath] };
    const taskGroups = [
        [
            new tasks.RevisionAssetsTask(site, options)
        ],
        [
            new tasks.RenderPagesTask(site)
        ],
        [
            new tasks.WritePagesTask(site),
            new tasks.WriteAssetsTask(site)
        ]
    ];
    await site.build(taskGroups);
};

/**
 * Watches for changes in the assets directory.
 */
const addWatcher = function(chokidar, watcherOptions, site) {
    const assetWatcher = chokidar.watch(site.config.assetsDir, watcherOptions);
    assetWatcher
        .on('add', async (filepath) => {
            await build(filepath, site);
        })
        .on('change', async (filepath) => {
            await build(filepath, site);
        })
        .on('unlink', async (filepath) => {
            // On deletion, delete the asset, then render pages and write any that have changed.
            await site.deleteAsset(filepath);
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
