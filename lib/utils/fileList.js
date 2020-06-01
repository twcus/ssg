const fsp = require('fs').promises;
const mapBy = require('./mapBy');

const fileList = async (dir) => mapBy((await fsp.readdir(dir, { withFileTypes: true })).filter(entry => entry.isFile()), 'name');

module.exports = fileList;
