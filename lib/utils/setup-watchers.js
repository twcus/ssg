const chokidar = require('chokidar');
const watchers = require('../watchers');

/**
 * Setup all of the file watchers.
 * @param {Site} site The Site being built.
 */
const setupWatchers = function(site) {
    const watcherOptions = {
        ignoreInitial: true
    };

    for (const watcher of Object.values(watchers)) {
        watcher.addWatcher(chokidar, watcherOptions, site);
    }

};

module.exports = setupWatchers;
