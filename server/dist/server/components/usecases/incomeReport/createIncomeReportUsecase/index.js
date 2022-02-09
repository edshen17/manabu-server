"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateIncomeReportUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const incomeReport_1 = require("../../../dataAccess/services/incomeReport");
const incomeReport_2 = require("../../../entities/incomeReport");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
const createIncomeReportUsecase_1 = require("./createIncomeReportUsecase");
const makeCreateIncomeReportUsecase = new createIncomeReportUsecase_1.CreateIncomeReportUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeIncomeReportEntity: incomeReport_2.makeIncomeReportEntity,
    makeDbService: incomeReport_1.makeIncomeReportDbService,
    deepEqual: deep_equal_1.default,
});
exports.makeCreateIncomeReportUsecase = makeCreateIncomeReportUsecase;
