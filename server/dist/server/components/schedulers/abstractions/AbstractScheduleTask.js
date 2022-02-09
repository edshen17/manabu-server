"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractScheduleTask = void 0;
class AbstractScheduleTask {
    _dayjs;
    init = async (initParams) => {
        const { dayjs, ...optionalScheduleTaskInitParams } = initParams;
        this._dayjs = dayjs;
        await this._initTemplate(optionalScheduleTaskInitParams);
        return this;
    };
    _initTemplate = async (optionalScheduleTaskInitParams) => {
        return;
    };
}
exports.AbstractScheduleTask = AbstractScheduleTask;
