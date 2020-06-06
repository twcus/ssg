const minify = require('@node-minify/core');
const htmlMinifier = require('@node-minify/html-minifier');
const cssMinifier = require('@node-minify/csso');
const javascriptMinifier = require('@node-minify/uglify-es');

/**
 * Minify HTML.
 * @param {string} html The HTML to minify.
 * @returns {Promise} Promise that resolves with the minified HTML.
 */
const minifyHtml = (html) => html ? minify({ compressor: htmlMinifier, content: html }) : html;

/**
 * Minify CSS.
 * @param {string} css The CSS to minify.
 * @returns {Promise} Promise that resolves with the minified CSS.
 */
const minifyCss = (css) => css ? minify({ compressor: cssMinifier, content: css }) : css;

/**
 * Minify Javascript.
 * @param {string} javascript The Javascript to minify.
 * @returns {Promise} Promise that resolves with the minified Javascript.
 */
const minifyJs = (javascript) => javascript ? minify({ compressor: javascriptMinifier, content: javascript }) : javascript;

/**
 * Map extensions to their respective minify functions.
 */
const extensionMap = {
    '.html': minifyHtml,
    '.css': minifyCss,
    '.js': minifyJs
};

module.exports = {
    minifyHtml,
    minifyCss,
    minifyJs,
    extensionMap
};
