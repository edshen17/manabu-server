"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBalanceTransactionDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const mongoose_1 = __importDefault(require("mongoose"));
const BalanceTransaction_1 = require("../../../../models/BalanceTransaction");
const cache_1 = require("../cache");
const packageTransaction_1 = require("../packageTransaction");
const balanceTransactionDbService_1 = require("./balanceTransactionDbService");
const makeBalanceTransactionDbService = new balanceTransactionDbService_1.BalanceTransactionDbService().init({
    mongoose: mongoose_1.default,
    dbModel: BalanceTransaction_1.BalanceTransaction,
    cloneDeep: clone_deep_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
    makePackageTransactionDbService: packageTransaction_1.makePackageTransactionDbService,
});
exports.makeBalanceTransactionDbService = makeBalanceTransactionDbService;
