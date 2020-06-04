const server = require('live-server');

/**
 * Start the development server.
 * @param {Site} site The Site being built.
 */
const startServer = function(site) {
    server.start(site.config.server);
};

module.exports = startServer;