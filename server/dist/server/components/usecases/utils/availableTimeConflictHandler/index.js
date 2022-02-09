"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAvailableTimeConflictHandler = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const appointment_1 = require("../../../dataAccess/services/appointment");
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const availableTimeConflictHandler_1 = require("./availableTimeConflictHandler");
const makeAvailableTimeConflictHandler = new availableTimeConflictHandler_1.AvailableTimeConflictHandler().init({
    makeAvailableTimeDbService: availableTime_1.makeAvailableTimeDbService,
    makeAppointmentDbService: appointment_1.makeAppointmentDbService,
    dayjs: dayjs_1.default,
});
exports.makeAvailableTimeConflictHandler = makeAvailableTimeConflictHandler;
