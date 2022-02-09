"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditAvailableTimeUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const entity_1 = require("../../../validators/availableTime/entity");
const params_1 = require("../../../validators/availableTime/params");
const query_1 = require("../../../validators/base/query");
const availableTimeConflictHandler_1 = require("../../utils/availableTimeConflictHandler");
const editAvailableTimeUsecase_1 = require("./editAvailableTimeUsecase");
const makeEditAvailableTimeUsecase = new editAvailableTimeUsecase_1.EditAvailableTimeUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeAvailableTimeParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeDbService: availableTime_1.makeAvailableTimeDbService,
    deepEqual: deep_equal_1.default,
    makeEditEntityValidator: entity_1.makeAvailableTimeEntityValidator,
    makeAvailableTimeConflictHandler: availableTimeConflictHandler_1.makeAvailableTimeConflictHandler,
});
exports.makeEditAvailableTimeUsecase = makeEditAvailableTimeUsecase;
