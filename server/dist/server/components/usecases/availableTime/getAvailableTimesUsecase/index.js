"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAvailableTimesUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const dayjs_1 = __importDefault(require("dayjs"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const query_1 = require("../../../validators/availableTime/query");
const params_1 = require("../../../validators/user/params");
const getAvailableTimesUsecase_1 = require("./getAvailableTimesUsecase");
const makeGetAvailableTimesUsecase = new getAvailableTimesUsecase_1.GetAvailableTimesUsecase().init({
    makeDbService: availableTime_1.makeAvailableTimeDbService,
    makeParamsValidator: params_1.makeUserParamsValidator,
    makeQueryValidator: query_1.makeAvailableTimeQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    dayjs: dayjs_1.default,
});
exports.makeGetAvailableTimesUsecase = makeGetAvailableTimesUsecase;
