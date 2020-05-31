const mapBy = function(arr, prop) {
    return arr.map(item => item[prop]);
};

module.exports = mapBy;
