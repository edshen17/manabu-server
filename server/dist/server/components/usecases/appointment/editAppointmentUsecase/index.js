"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditAppointmentUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const appointment_1 = require("../../../dataAccess/services/appointment");
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const availableTime_2 = require("../../../entities/availableTime");
const entity_1 = require("../../../validators/appointment/entity");
const params_1 = require("../../../validators/appointment/params");
const query_1 = require("../../../validators/base/query");
const splitAvailableTimeHandler_1 = require("../../utils/splitAvailableTimeHandler");
const editAppointmentUsecase_1 = require("./editAppointmentUsecase");
const makeEditAppointmentUsecase = new editAppointmentUsecase_1.EditAppointmentUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeAppointmentParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeDbService: appointment_1.makeAppointmentDbService,
    deepEqual: deep_equal_1.default,
    makeEditEntityValidator: entity_1.makeAppointmentEntityValidator,
    makeSplitAvailableTimeHandler: splitAvailableTimeHandler_1.makeSplitAvailableTimeHandler,
    makeAvailableTimeDbService: availableTime_1.makeAvailableTimeDbService,
    makeAvailableTimeEntity: availableTime_2.makeAvailableTimeEntity,
});
exports.makeEditAppointmentUsecase = makeEditAppointmentUsecase;
