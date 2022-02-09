"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetExchangeRatesUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const stub_1 = require("../../../dataAccess/services/stub");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
const exchangeRateHandler_1 = require("../../utils/exchangeRateHandler");
const getExchangeRatesUsecase_1 = require("./getExchangeRatesUsecase");
const makeGetExchangeRatesUsecase = new getExchangeRatesUsecase_1.GetExchangeRatesUsecase().init({
    makeDbService: stub_1.makeStubDbService,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    makeExchangeRateHandler: exchangeRateHandler_1.makeExchangeRateHandler,
});
exports.makeGetExchangeRatesUsecase = makeGetExchangeRatesUsecase;
