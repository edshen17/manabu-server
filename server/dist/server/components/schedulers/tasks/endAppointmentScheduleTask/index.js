"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEndAppointmentScheduleTask = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const appointment_1 = require("../../../dataAccess/services/appointment");
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const emailHandler_1 = require("../../../usecases/utils/emailHandler");
const endAppointmentScheduleTask_1 = require("./endAppointmentScheduleTask");
const makeEndAppointmentScheduleTask = new endAppointmentScheduleTask_1.EndAppointmentScheduleTask().init({
    dayjs: dayjs_1.default,
    makeAppointmentDbService: appointment_1.makeAppointmentDbService,
    makeEmailHandler: emailHandler_1.makeEmailHandler,
    makePackageTransactionDbService: packageTransaction_1.makePackageTransactionDbService,
});
exports.makeEndAppointmentScheduleTask = makeEndAppointmentScheduleTask;
