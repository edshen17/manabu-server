"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateAvailableTimeUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const availableTime_2 = require("../../../entities/availableTime");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
const availableTimeConflictHandler_1 = require("../../utils/availableTimeConflictHandler");
const createAvailableTimeUsecase_1 = require("./createAvailableTimeUsecase");
const makeCreateAvailableTimeUsecase = new createAvailableTimeUsecase_1.CreateAvailableTimeUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeAvailableTimeEntity: availableTime_2.makeAvailableTimeEntity,
    makeDbService: availableTime_1.makeAvailableTimeDbService,
    deepEqual: deep_equal_1.default,
    makeAvailableTimeConflictHandler: availableTimeConflictHandler_1.makeAvailableTimeConflictHandler,
});
exports.makeCreateAvailableTimeUsecase = makeCreateAvailableTimeUsecase;
