const config = require('./config');
const Site = require('./site');
const startServer = require('./utils/start-server');
const setupWatchers = require('./utils/setup-watchers');

module.exports = async function(args) {
    console.log('starting');
    const options = { isProduction: true };
    if (args.includes('-s') || args.includes('-d')) {
        options.isProduction = false;
    }
    const site = new Site(Object.assign(config, options));
    await site.cleanBuildDir();
    if (args.includes('-s')) {
        startServer(site);
        setupWatchers(site);
    }
    await site.build();
    console.log('finished');
};
