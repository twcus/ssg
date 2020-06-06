const path = require('path');
const CONFIG_PATH = './config.json'
const NO_CONFIG_FOUND = 'No config.json found, using default configuration settings.'

let fileConfig = {};
try {
    fileConfig = require(path.resolve(CONFIG_PATH));
} catch (err) {
    console.log(NO_CONFIG_FOUND);
}

const buildDir = fileConfig.buildDir || 'site';

const defaults = {
    assetsDir: 'assets',
    buildDir,
    contentDir: 'content',
    dataDir: 'data',
    helpersDir: 'helpers',
    layoutsDir: 'layouts',
    pagesDir: 'pages',
    partialsDir: 'partials',
    uncategorizedContentName: 'uncategorized',
    server: {
        host: '127.0.0.1',
        port: 8800,
        root: buildDir,
        open: true,
        wait: 500,
        logLevel: 1,
        noCssInject: true
    }
};

const config = { ...defaults, ...fileConfig };

module.exports = config;
