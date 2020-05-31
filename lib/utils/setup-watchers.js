const chokidar = require('chokidar');
const path = require('path');
const tasks = require('../tasks');

const setupWatchers = function(site) {
    const watcherOptions = {
        ignoreInitial: true
    };

    const helpersWatcher = chokidar.watch(site.config.helpersDir, Object.assign({ depth: 0 }, watcherOptions));
    helpersWatcher
        .on('add', async (filepath) => {
            const options = { fileList: [path.parse(filepath).base] };
            const registerHelpersTask = new tasks.RegisterHelpersTask(site, options);
            await registerHelpersTask.run();
        })
        .on('change', async (filepath) => {
            const options = { fileList: [path.parse(filepath).base] };
            const registerHelpersTask = new tasks.RegisterHelpersTask(site, options);
            await registerHelpersTask.run();
        })
        .on('unlink', async (filepath) => {
            site.unregisterHelper(path.parse(filepath).base);
        });

};

module.exports = setupWatchers;
