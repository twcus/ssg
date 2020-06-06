const constants = {
    INDEX_FILENAME: 'index.html',
    BLACKLIST_PATTERN: new RegExp('~$'), // TODO expand this to include hidden files and other junk. Consider using globbing instead of regex.
    MINIFIABLE_EXTS: [
        '.html',
        '.css',
        '.js'
    ]
};

module.exports = constants;
