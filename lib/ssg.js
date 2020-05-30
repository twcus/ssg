const config = require('./config');
const Site = require('./site');
const tasks = require('./tasks');

module.exports = async function(args) {
    console.log('starting');
    const site = new Site(config);
    let registerHelpersTask = new tasks.RegisterHelpersTask(site);
    let registerPartialsTask = new tasks.RegisterPartialsTask(site);
    let readDataTask = new tasks.ReadDataTask(site);
    let readLayoutsTask = new tasks.ReadLayoutsTask(site);
    let readContentTask = new tasks.ReadContentTask(site);
    let readPagesTask = new tasks.ReadPagesTask(site);
    // TODO minify/optimize assets
    let revisionAssetsTask = new tasks.RevisionAssetsTask(site);
    let renderPagesTask = new tasks.RenderPagesTask(site);
    let writePagesTask = new tasks.WritePagesTask(site);
    let writeAssetsTask = new tasks.WriteAssetsTask(site);
    const taskGroups = [
        [
            registerHelpersTask,
            registerPartialsTask,
            readDataTask,
            readLayoutsTask
        ],
        [
            readPagesTask,
            readContentTask,
            revisionAssetsTask
        ],
        [
            renderPagesTask
        ],
        [
            writePagesTask,
            writeAssetsTask
        ]
    ];
    for (const group of taskGroups) {
        await Promise.all(group.map(task => task.run()));
    }
    console.log('finished');
};
