"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPackageTransactionUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const query_1 = require("../../../validators/base/query");
const params_1 = require("../../../validators/packageTransaction/params");
const getPackageTransactionUsecase_1 = require("./getPackageTransactionUsecase");
const makeGetPackageTransactionUsecase = new getPackageTransactionUsecase_1.GetPackageTransactionUsecase().init({
    makeDbService: packageTransaction_1.makePackageTransactionDbService,
    makeParamsValidator: params_1.makePackageTransactionParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
});
exports.makeGetPackageTransactionUsecase = makeGetPackageTransactionUsecase;
