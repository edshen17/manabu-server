"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIncomeReportDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const mongoose_1 = __importDefault(require("mongoose"));
const IncomeReport_1 = require("../../../../models/IncomeReport");
const cache_1 = require("../cache");
const incomeReportDbService_1 = require("./incomeReportDbService");
const makeIncomeReportDbService = new incomeReportDbService_1.IncomeReportDbService().init({
    mongoose: mongoose_1.default,
    dbModel: IncomeReport_1.IncomeReport,
    cloneDeep: clone_deep_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makeIncomeReportDbService = makeIncomeReportDbService;
