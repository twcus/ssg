const fs = require('fs');
const fp = fs.promises;
const path = require('path');
const Handlebars = require('handlebars');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const config = require('./config');
const Site = require('./site');

let site = {};

/*
 * For each helpers in helpers dir, read the file and register it as a helper, using the filename as the helper name
 */
const registerHelpers = function() {
    console.log('registering helpers');
    const helpersPath = config.helpersDir;
    try {
        let files = fs.readdirSync(helpersPath);
        console.log(files);
        files.forEach(f => {
            const helperName = path.parse(f).name;
            const helper = require(path.resolve(helpersPath, f));
            Handlebars.registerHelper(helperName, helper);
        })
    } catch(err) {
        console.log(err);
    }
};

/*
 * For each partial in partials dir, read the file and register it as a partial with Handlebars
 */
const registerPartials = async function() {
    console.log('registering partials');
    const partialsPath = config.partialsDir;
    try {
        let files = await fp.readdir(partialsPath);
        console.log(files);
        files.forEach(f => {
            const fileContent = fs.readFileSync(`${partialsPath}/${f}`).toString();
            Handlebars.registerPartial(path.parse(f).name, fileContent);
        })
    } catch(err) {
        console.log(err);
    }
};

/*
 * For each page in pages dir, read the file, compile a Handlebars template, then write the result to the build dir
 */
const generateHtml = async function() {
    console.log('generating pages');
    let outputContent = {};
    const pagesPath = config.pagesDir;
    try {
        let files = await fp.readdir(pagesPath);
        console.log(files);
        files.forEach(f => {
            const filename = path.parse(f).name;
            const fileContent = fs.readFileSync(`${pagesPath}/${f}`).toString();
            const template = Handlebars.compile(fileContent);
            outputContent[filename] = template({site: site});
        });
        await fp.mkdir(config.buildDir, { recursive: true });
        for (const [filename, fileOutput] of Object.entries(outputContent)) {
            fs.writeFileSync(`${config.buildDir}/${filename}.html`, fileOutput);
        }
    } catch (err) {
        console.log(err);
    }
}

/*
 * For each post in posts dir, read the file, parse the frontmatter, parse the markdown into HTML, compile a Handlebars template with the context of the frontmatter, then write the result to the build dir
 * content structure - must recursively search content dir for all files, and get their paths
 */
const generatePosts = async function() {
    console.log('generating pages');
    let outputContent = {};
    const postsPath = `${config.contentDir}/posts`;
    const layoutsPath = config.layoutsDir;
    const md = new MarkdownIt();
    try {
        let files = await fp.readdir(postsPath);
        console.log(files);
        files.forEach(f => {
            const filename = path.parse(f).name;
            const fileContent = fs.readFileSync(`${postsPath}/${f}`);
            const parsedContent = matter(fileContent);
            let context = { post: parsedContent.data };
            context.post.content = md.render(parsedContent.content);
            const layoutContent = fs.readFileSync(`${layoutsPath}/${parsedContent.data.layout}.hbs`).toString(); // need to properly handle file extensions
            const template = Handlebars.compile(layoutContent);
            outputContent[filename] = template(context);
        });
        console.log(path.join(config.buildDir, 'posts/'));
        await fp.mkdir(path.join(config.buildDir, 'posts'), { recursive: true })
        for (const [filename, fileOutput] of Object.entries(outputContent)) {
            fs.writeFileSync(`${config.buildDir}/posts/${filename}.html`, fileOutput); // build dir = config option, posts dir also config option?
        }
    } catch (err) {
        console.log(err);
    }
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
//
// const test = async function(arg) {
//     console.log(`starting ${arg}`);
//     await sleep(5000);
//     console.log(`finishing ${arg}`);
// }
//
// let promises = [];
// for (let i = 1; i <= 20; i++) {
//     promises.push(test(i));
//     console.log(`after ${i}`);
// }
// await Promise.all(promises);
// console.log('done');
// return;

module.exports = async function(args) {
    console.log('starting');
    const site = new Site(config);
    console.log(site);
    registerHelpers();
    await registerPartials();
    await generateHtml();
    await generatePosts();
    console.log('finished')
}