"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateBalanceTransactionsUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const balanceTransaction_1 = require("../../../dataAccess/services/balanceTransaction");
const balanceTransaction_2 = require("../../../entities/balanceTransaction");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
const createBalanceTransactionsUsecase_1 = require("./createBalanceTransactionsUsecase");
const makeCreateBalanceTransactionsUsecase = new createBalanceTransactionsUsecase_1.CreateBalanceTransactionsUsecase().init({
    makeDbService: balanceTransaction_1.makeBalanceTransactionDbService,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    makeBalanceTransactionEntity: balanceTransaction_2.makeBalanceTransactionEntity,
});
exports.makeCreateBalanceTransactionsUsecase = makeCreateBalanceTransactionsUsecase;
