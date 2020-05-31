const server = require('live-server');

const startServer = function(site) {
    server.start(site.config.server);
};

module.exports = startServer;