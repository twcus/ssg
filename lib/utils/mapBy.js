/**
 * Map an array of items to a given key.
 * @param {Object[]} arr An array of objects.
 * @param {string} key The key to map objects by.
 * @returns {Object[]} An array of objects mapped to the key.
 */
const mapBy = (arr, key) => {
    return arr.map(item => item[key]);
};

module.exports = mapBy;
