const { BLACKLIST_PATTERN } = require('./constants');

/**
 * Filter a list of files and directories based on the blacklist pattern.
 * @param {Object[]} entries An array of file and directory entries.
 * @returns {Object[]} An array of file and directory entries that don't match the blacklist pattern.
 */
const filterFiles = (entries) => entries.filter(entry => !BLACKLIST_PATTERN.test(entry.name));

module.exports = filterFiles;
