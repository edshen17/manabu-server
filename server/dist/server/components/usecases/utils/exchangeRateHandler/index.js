"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExchangeRateHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const money_1 = __importDefault(require("money"));
const cache_1 = require("../../../dataAccess/services/cache");
const exchangeRateHandler_1 = require("./exchangeRateHandler");
const currency = require('currency.js');
const makeExchangeRateHandler = new exchangeRateHandler_1.ExchangeRateHandler().init({
    axios: axios_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
    money: money_1.default,
    currency,
});
exports.makeExchangeRateHandler = makeExchangeRateHandler;
