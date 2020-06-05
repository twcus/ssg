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
const minifyCss = (css) => minify({ compressor: htmlMinifier, content: css });

/**
 * Minify Javascript.
 * @param {string} javascript The Javascript to minify.
 * @returns {Promise} Promise that resolves with the minified Javascript.
 */
const minifyJs = (javascript) => minify({ compressor: htmlMinifier, content: javascript });

module.exports = {
    minifyHtml,
    minifyCss,
    minifyJs
};
