"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSendAppointmentReminderScheduleTask = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const appointment_1 = require("../../../dataAccess/services/appointment");
const cache_1 = require("../../../dataAccess/services/cache");
const emailHandler_1 = require("../../../usecases/utils/emailHandler");
const sendAppointmentReminderScheduleTask_1 = require("./sendAppointmentReminderScheduleTask");
const makeSendAppointmentReminderScheduleTask = new sendAppointmentReminderScheduleTask_1.SendAppointmentReminderScheduleTask().init({
    dayjs: dayjs_1.default,
    makeAppointmentDbService: appointment_1.makeAppointmentDbService,
    makeCacheDbService: cache_1.makeCacheDbService,
    makeEmailHandler: emailHandler_1.makeEmailHandler,
});
exports.makeSendAppointmentReminderScheduleTask = makeSendAppointmentReminderScheduleTask;
