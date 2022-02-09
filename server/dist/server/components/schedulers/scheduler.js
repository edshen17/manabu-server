"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const AbstractScheduler_1 = require("./abstractions/AbstractScheduler");
var SCHEDULER_INTERVAL;
(function (SCHEDULER_INTERVAL) {
    SCHEDULER_INTERVAL["FIVE_MINUTES"] = "0 */5 * * * *";
    SCHEDULER_INTERVAL["ONE_HOUR"] = "0 */60 * * * *";
})(SCHEDULER_INTERVAL || (SCHEDULER_INTERVAL = {}));
class Scheduler extends AbstractScheduler_1.AbstractScheduler {
    _endAppointmentScheduleTask;
    _endPackageTransactionScheduleTask;
    _sendAppointmentReminderScheduleTask;
    start = async () => {
        try {
            const self = this;
            const cronJob = new this._cron(SCHEDULER_INTERVAL.FIVE_MINUTES, async function () {
                await self._endAppointmentScheduleTask.execute();
                await self._endPackageTransactionScheduleTask.execute();
                await self._sendAppointmentReminderScheduleTask.execute();
                self._cronJobs.push(cronJob);
            }, null, true, 'America/New_York');
            cronJob.start();
        }
        catch (err) {
            console.log(err);
        }
    };
    _initTemplate = async (optionalSchedulerInitParams) => {
        const { makeEndAppointmentScheduleTask, makeEndPackageTransactionScheduleTask, makeSendAppointmentReminderScheduleTask, } = optionalSchedulerInitParams;
        this._endAppointmentScheduleTask = await makeEndAppointmentScheduleTask;
        this._endPackageTransactionScheduleTask = await makeEndPackageTransactionScheduleTask;
        this._sendAppointmentReminderScheduleTask = await makeSendAppointmentReminderScheduleTask;
    };
}
exports.Scheduler = Scheduler;
