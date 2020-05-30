const path = require('path');
const CONFIG_PATH = './config.json'
const NO_CONFIG_FOUND = 'No config.json found, using default configuration settings.'

let fileConfig = {};
try {
    fileConfig = require(path.resolve(CONFIG_PATH));
} catch (err) {
    console.log(NO_CONFIG_FOUND);
}

const defaults = {
    assetsDir: 'assets',
    buildDir: 'site',
    contentDir: 'content',
    dataDir: 'data',
    helpersDir: 'helpers',
    layoutsDir: 'layouts',
    pagesDir: 'pages',
    partialsDir: 'partials',
    uncategorizedContentName: 'uncategorized',
    content: {
        posts: {
            outputDir: 'blog'
        }
    }
};

const config = { ...defaults, ...fileConfig };

module.exports = config;
