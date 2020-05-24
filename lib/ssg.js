const fs = require('fs');
const fp = fs.promises;
const path = require('path');
const Handlebars = require('handlebars');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const config = require('./config');
const Site = require('./site');
const tasks = require('./tasks');

module.exports = async function(args) {
    console.log('starting');
    const site = new Site(config);
    tasks.registerHelpers(site);
    tasks.registerPartials(site);
    tasks.readData(site);
    tasks.readLayouts(site);
    tasks.readContent(site);
    tasks.readPages(site);
    tasks.renderPages(site);
    tasks.writePages(site);
    console.log('finished')
}