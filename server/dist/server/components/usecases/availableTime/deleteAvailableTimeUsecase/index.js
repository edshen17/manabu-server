"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeleteAvailableTimeUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const entity_1 = require("../../../validators/availableTime/entity");
const params_1 = require("../../../validators/availableTime/params");
const query_1 = require("../../../validators/base/query");
const deleteAvailableTimeUsecase_1 = require("./deleteAvailableTimeUsecase");
const makeDeleteAvailableTimeUsecase = new deleteAvailableTimeUsecase_1.DeleteAvailableTimeUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeAvailableTimeParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeDbService: availableTime_1.makeAvailableTimeDbService,
    deepEqual: deep_equal_1.default,
    makeDeleteEntityValidator: entity_1.makeAvailableTimeEntityValidator,
});
exports.makeDeleteAvailableTimeUsecase = makeDeleteAvailableTimeUsecase;
