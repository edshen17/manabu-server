"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEndPackageTransactionScheduleTask = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const balanceTransaction_1 = require("../../../dataAccess/services/balanceTransaction");
const incomeReport_1 = require("../../../dataAccess/services/incomeReport");
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const user_1 = require("../../../dataAccess/services/user");
const balanceTransaction_2 = require("../../../entities/balanceTransaction");
const dateRangeKeyHandler_1 = require("../../../entities/utils/dateRangeKeyHandler");
const paypal_1 = require("../../../payment/services/paypal");
const endPackageTransactionScheduleTask_1 = require("./endPackageTransactionScheduleTask");
const currency = require('currency.js');
const makeEndPackageTransactionScheduleTask = new endPackageTransactionScheduleTask_1.EndPackageTransactionScheduleTask().init({
    dayjs: dayjs_1.default,
    makePackageTransactionDbService: packageTransaction_1.makePackageTransactionDbService,
    makeUserDbService: user_1.makeUserDbService,
    makeBalanceTransactionDbService: balanceTransaction_1.makeBalanceTransactionDbService,
    makeBalanceTransactionEntity: balanceTransaction_2.makeBalanceTransactionEntity,
    makePaypalPaymentService: paypal_1.makePaypalPaymentService,
    currency,
    makeIncomeReportDbService: incomeReport_1.makeIncomeReportDbService,
    makeDateRangeKeyHandler: dateRangeKeyHandler_1.makeDateRangeKeyHandler,
});
exports.makeEndPackageTransactionScheduleTask = makeEndPackageTransactionScheduleTask;
