"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractScheduler = void 0;
class AbstractScheduler {
    _cron;
    _cronJobs = [];
    stop = async () => {
        for (const cronJob of this._cronJobs) {
            cronJob.stop();
        }
    };
    init = async (initParams) => {
        const { cron, ...optionalSchedulerInitParams } = initParams;
        this._cron = cron;
        await this._initTemplate(optionalSchedulerInitParams);
        return this;
    };
    _initTemplate = async (optionalSchedulerInitParams) => {
        return;
    };
}
exports.AbstractScheduler = AbstractScheduler;
