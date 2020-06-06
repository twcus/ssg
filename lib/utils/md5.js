const crypto = require('crypto');

/**
 * Calculates the md5 hash of the given data.
 * @param {*} data The data to calculate the md5 has for.
 * @returns {string} The md5 hash.
 */
const md5 = (data) => crypto.createHash('md5').update(data).digest("hex");

module.exports = md5;
