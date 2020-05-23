const path = require('path');
const fs = require('fs');
const fp = fs.promises;

class Page {
    constructor() {
        const { name, description, url } = options;
        Object.assign(this, { name, description, url});
        this.pages = [];
    }
}

module.exports = Page;
