"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAppointmentsUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const appointment_1 = require("../../../dataAccess/services/appointment");
const query_1 = require("../../../validators/appointment/query");
const params_1 = require("../../../validators/user/params");
const getAppointmentsUsecase_1 = require("./getAppointmentsUsecase");
const makeGetAppointmentsUsecase = new getAppointmentsUsecase_1.GetAppointmentsUsecase().init({
    makeDbService: appointment_1.makeAppointmentDbService,
    makeParamsValidator: params_1.makeUserParamsValidator,
    makeQueryValidator: query_1.makeAppointmentQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
});
exports.makeGetAppointmentsUsecase = makeGetAppointmentsUsecase;
