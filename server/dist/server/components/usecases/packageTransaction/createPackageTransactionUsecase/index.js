"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePackageTransactionUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const cache_1 = require("../../../dataAccess/services/cache");
const graph_1 = require("../../../dataAccess/services/graph");
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const teacher_1 = require("../../../dataAccess/services/teacher");
const user_1 = require("../../../dataAccess/services/user");
const packageTransaction_2 = require("../../../entities/packageTransaction");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/packageTransaction/query");
const createAppointmentsUsecase_1 = require("../../appointment/createAppointmentsUsecase");
const createBalanceTransactionsUsecase_1 = require("../../balanceTransaction/createBalanceTransactionsUsecase");
const createIncomeReportUsecase_1 = require("../../incomeReport/createIncomeReportUsecase");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
const emailHandler_1 = require("../../utils/emailHandler");
const exchangeRateHandler_1 = require("../../utils/exchangeRateHandler");
const jwtHandler_1 = require("../../utils/jwtHandler");
const createPackageTransactionUsecase_1 = require("./createPackageTransactionUsecase");
const makeCreatePackageTransactionUsecase = new createPackageTransactionUsecase_1.CreatePackageTransactionUsecase().init({
    makeDbService: packageTransaction_1.makePackageTransactionDbService,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makePackageTransactionQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    makeJwtHandler: jwtHandler_1.makeJwtHandler,
    makeCacheDbService: cache_1.makeCacheDbService,
    makePackageTransactionEntity: packageTransaction_2.makePackageTransactionEntity,
    makeUserDbService: user_1.makeUserDbService,
    makeExchangeRateHandler: exchangeRateHandler_1.makeExchangeRateHandler,
    makeCreateBalanceTransactionsUsecase: createBalanceTransactionsUsecase_1.makeCreateBalanceTransactionsUsecase,
    makeControllerDataBuilder: controllerDataBuilder_1.makeControllerDataBuilder,
    makeEmailHandler: emailHandler_1.makeEmailHandler,
    makeCreateIncomeReportUsecase: createIncomeReportUsecase_1.makeCreateIncomeReportUsecase,
    makeCreateAppointmentsUsecase: createAppointmentsUsecase_1.makeCreateAppointmentsUsecase,
    makeGraphDbService: graph_1.makeGraphDbService,
    makeTeacherDbService: teacher_1.makeTeacherDbService,
});
exports.makeCreatePackageTransactionUsecase = makeCreatePackageTransactionUsecase;
