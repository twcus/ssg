/**
 * A BuildTask is a specific build operation, which is performed with the run() method.
 * Tasks can either be synchronous or asynchronous.
 */
class BuildTask {
    /**
     * Create a new BuildTask.
     * @param {Site} site The Site running this task.
     * @param {Object} options A hash of additional options for this task.
     */
    constructor(site, options = {}) {
        this.site = site;
        this.options = options;
    }

    /**
     * Run the task.
     */
     run() {
        return true;
    }
}

module.exports = BuildTask;
