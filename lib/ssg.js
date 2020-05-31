const config = require('./config');
const Site = require('./site');
const tasks = require('./tasks');
const startServer = require('./utils/start-server');
const setupWatchers = require('./utils/setup-watchers');

module.exports = async function(args) {
    console.log('starting');
    const site = new Site(config);
    if (args.includes('-s')) {
        startServer(site);
        setupWatchers(site);
    }
    await site.build();
    console.log('finished');
};
