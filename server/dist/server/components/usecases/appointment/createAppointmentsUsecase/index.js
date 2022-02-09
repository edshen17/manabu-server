"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateAppointmentsUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const dayjs_1 = __importDefault(require("dayjs"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const appointment_1 = require("../../../dataAccess/services/appointment");
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const appointment_2 = require("../../../entities/appointment");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
const emailHandler_1 = require("../../utils/emailHandler");
const splitAvailableTimeHandler_1 = require("../../utils/splitAvailableTimeHandler");
const createAppointmentsUsecase_1 = require("./createAppointmentsUsecase");
const makeCreateAppointmentsUsecase = new createAppointmentsUsecase_1.CreateAppointmentsUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeAppointmentEntity: appointment_2.makeAppointmentEntity,
    makeDbService: appointment_1.makeAppointmentDbService,
    deepEqual: deep_equal_1.default,
    makePackageTransactionDbService: packageTransaction_1.makePackageTransactionDbService,
    makeSplitAvailableTimeHandler: splitAvailableTimeHandler_1.makeSplitAvailableTimeHandler,
    dayjs: dayjs_1.default,
    makeAvailableTimeDbService: availableTime_1.makeAvailableTimeDbService,
    makeEmailHandler: emailHandler_1.makeEmailHandler,
});
exports.makeCreateAppointmentsUsecase = makeCreateAppointmentsUsecase;
