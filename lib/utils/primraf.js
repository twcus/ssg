const { promisify } = require('util');
const rimraf = require('rimraf');

/**
 * Promisified rimraf.
 * @param {string} dir The directory to delete.
 * @returns {Promise} A promise that resolves with the rimraf result.
 */
const primraf = promisify(rimraf);

module.exports = primraf;
