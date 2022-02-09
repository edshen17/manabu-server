"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeScheduler = void 0;
const cron_1 = require("cron");
const scheduler_1 = require("./scheduler");
const endAppointmentScheduleTask_1 = require("./tasks/endAppointmentScheduleTask");
const endPackageTransactionScheduleTask_1 = require("./tasks/endPackageTransactionScheduleTask");
const sendAppointmentReminderScheduleTask_1 = require("./tasks/sendAppointmentReminderScheduleTask");
const cron = cron_1.CronJob;
const makeScheduler = new scheduler_1.Scheduler().init({
    cron,
    makeEndPackageTransactionScheduleTask: endPackageTransactionScheduleTask_1.makeEndPackageTransactionScheduleTask,
    makeEndAppointmentScheduleTask: endAppointmentScheduleTask_1.makeEndAppointmentScheduleTask,
    makeSendAppointmentReminderScheduleTask: sendAppointmentReminderScheduleTask_1.makeSendAppointmentReminderScheduleTask,
});
exports.makeScheduler = makeScheduler;
