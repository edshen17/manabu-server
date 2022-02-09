"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbIncomeReportFactory = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const dayjs_1 = __importDefault(require("dayjs"));
const incomeReport_1 = require("../../../entities/incomeReport");
const incomeReport_2 = require("../../services/incomeReport");
const fakeDbIncomeReportFactory_1 = require("./fakeDbIncomeReportFactory");
const makeFakeDbIncomeReportFactory = new fakeDbIncomeReportFactory_1.FakeDbIncomeReportFactory().init({
    makeEntity: incomeReport_1.makeIncomeReportEntity,
    cloneDeep: clone_deep_1.default,
    makeDbService: incomeReport_2.makeIncomeReportDbService,
    dayjs: dayjs_1.default,
});
exports.makeFakeDbIncomeReportFactory = makeFakeDbIncomeReportFactory;
