"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExchangeRatesUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetExchangeRatesUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _exchangeRateHandler;
    _makeRequestTemplate = async (props) => {
        const exchangeRates = await this._exchangeRateHandler.getRates();
        return { exchangeRates };
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeExchangeRateHandler } = optionalInitParams;
        this._exchangeRateHandler = await makeExchangeRateHandler;
    };
}
exports.GetExchangeRatesUsecase = GetExchangeRatesUsecase;
