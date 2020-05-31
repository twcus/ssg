const path = require('path');
const tasks = require('../tasks');

const build = async (filepath, site) => {
    const options = { files: [path.parse(filepath).base] };
    const taskGroups = [
        [
            new tasks.RegisterHelpersTask(site, options)
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

const helperWatcher = function(chokidar, watcherOptions, site) {
    const helperWatcher = chokidar.watch(site.config.helpersDir, Object.assign({ depth: 0 }, watcherOptions));
    helperWatcher
        .on('add', async (filepath) => {
            await build(filepath, site);
        })
        .on('change', async (filepath) => {
            await build(filepath, site);
        })
        .on('unlink', async (filepath) => {
            site.unregisterHelper(path.parse(filepath).base);
            await build(filepath, site);
        });
};

module.exports = {
    addWatcher: helperWatcher
};
