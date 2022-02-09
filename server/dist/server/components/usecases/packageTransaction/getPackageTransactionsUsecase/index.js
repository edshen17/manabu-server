"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPackageTransactionsUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const query_1 = require("../../../validators/packageTransaction/query");
const params_1 = require("../../../validators/user/params");
const getPackageTransactionsUsecase_1 = require("./getPackageTransactionsUsecase");
const makeGetPackageTransactionsUsecase = new getPackageTransactionsUsecase_1.GetPackageTransactionsUsecase().init({
    makeDbService: packageTransaction_1.makePackageTransactionDbService,
    makeParamsValidator: params_1.makeUserParamsValidator,
    makeQueryValidator: query_1.makePackageTransactionQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
});
exports.makeGetPackageTransactionsUsecase = makeGetPackageTransactionsUsecase;
