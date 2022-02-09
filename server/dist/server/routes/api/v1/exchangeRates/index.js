"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRates = void 0;
const express_1 = __importDefault(require("express"));
const getExchangeRatesController_1 = require("../../../../components/controllers/exchangeRate/getExchangeRatesController");
const expressCallback_1 = require("../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const exchangeRates = express_1.default.Router();
exports.exchangeRates = exchangeRates;
exchangeRates.get('/', expressCallback_1.makeJSONExpressCallback.consume(getExchangeRatesController_1.makeGetExchangeRatesController));
