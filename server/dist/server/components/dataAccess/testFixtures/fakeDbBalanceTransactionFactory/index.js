"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbBalanceTransactionFactory = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const balanceTransaction_1 = require("../../../entities/balanceTransaction");
const balanceTransaction_2 = require("../../services/balanceTransaction");
const fakeDbPackageTransactionFactory_1 = require("../fakeDbPackageTransactionFactory");
const fakeDbBalanceTransactionFactory_1 = require("./fakeDbBalanceTransactionFactory");
const makeFakeDbBalanceTransactionFactory = new fakeDbBalanceTransactionFactory_1.FakeDbBalanceTransactionFactory().init({
    cloneDeep: clone_deep_1.default,
    makeEntity: balanceTransaction_1.makeBalanceTransactionEntity,
    makeDbService: balanceTransaction_2.makeBalanceTransactionDbService,
    makeFakeDbPackageTransactionFactory: fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory,
});
exports.makeFakeDbBalanceTransactionFactory = makeFakeDbBalanceTransactionFactory;
