"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRateHandler = void 0;
const constants_1 = require("../../../../constants");
const cacheDbService_1 = require("../../../dataAccess/services/cache/cacheDbService");
class ExchangeRateHandler {
    _axios;
    _cacheDbService;
    _fx;
    _currency;
    getRates = async () => {
        const cacheKeys = {
            hashKey: 'exchangerate',
            key: 'latest',
        };
        const exchangeRateAPIUrl = this._getExchangeRateAPIUrl();
        let cachedExchangeRates = await this._cacheDbService.get(cacheKeys);
        if (!cachedExchangeRates) {
            const latestExchangeRatesRes = (await this._axios.get(exchangeRateAPIUrl)).data;
            cachedExchangeRates = await this._cacheDbService.set({
                ...cacheKeys,
                value: latestExchangeRatesRes.rates,
                ttlMs: cacheDbService_1.TTL_MS.DAY,
            });
        }
        return cachedExchangeRates;
    };
    _getExchangeRateAPIUrl = () => {
        let apiKey = constants_1.OPEN_EXCHANGE_RATE_API_KEY_DEV;
        if (constants_1.IS_PRODUCTION) {
            apiKey = constants_1.OPEN_EXCHANGE_RATE_API_KEY;
        }
        return `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
    };
    convert = async (props) => {
        const { amount, sourceCurrency, targetCurrency } = props;
        this._fx.base = 'USD'; // default open exchange rate base
        this._fx.rates = await this.getRates();
        const convertedAmount = this._fx(amount)
            .from(sourceCurrency.toUpperCase())
            .to(targetCurrency.toUpperCase());
        const formattedAmount = this.toCurrency(convertedAmount);
        return formattedAmount;
    };
    add = async (props) => {
        const { addend1, addend2, targetCurrency } = props;
        const convertedAddend1 = addend1.sourceCurrency
            ? await this.convert({
                amount: addend1.amount,
                sourceCurrency: addend1.sourceCurrency,
                targetCurrency,
            })
            : addend1.amount;
        const convertedAddend2 = addend2.sourceCurrency
            ? await this.convert({
                amount: addend2.amount,
                sourceCurrency: addend2.sourceCurrency,
                targetCurrency,
            })
            : addend2.amount;
        const convertedSum = this._currency(convertedAddend1).add(convertedAddend2).value;
        return convertedSum;
    };
    subtract = async (props) => {
        const { minuend, subtrahend, targetCurrency } = props;
        const convertedMinuend = minuend.sourceCurrency
            ? await this.convert({
                amount: minuend.amount,
                sourceCurrency: minuend.sourceCurrency,
                targetCurrency,
            })
            : minuend.amount;
        const convertedSubtrahend = subtrahend.sourceCurrency
            ? await this.convert({
                amount: subtrahend.amount,
                sourceCurrency: subtrahend.sourceCurrency,
                targetCurrency,
            })
            : subtrahend.amount;
        const convertedDiff = this._currency(convertedMinuend).subtract(convertedSubtrahend).value;
        return convertedDiff;
    };
    multiply = async (props) => {
        const { multiplicand, multiplier, targetCurrency } = props;
        const convertedMultiplicand = multiplicand.sourceCurrency
            ? await this.convert({
                amount: multiplicand.amount,
                sourceCurrency: multiplicand.sourceCurrency,
                targetCurrency,
            })
            : multiplicand.amount;
        const convertedMultiplier = multiplier.sourceCurrency
            ? await this.convert({
                amount: multiplier.amount,
                sourceCurrency: multiplier.sourceCurrency,
                targetCurrency,
            })
            : multiplier.amount;
        const convertedProduct = this._currency(convertedMultiplicand).multiply(convertedMultiplier).value;
        return convertedProduct;
    };
    toCurrency = (num) => {
        const convertedNum = this._currency(num).value;
        return convertedNum;
    };
    init = async (props) => {
        const { axios, makeCacheDbService, money, currency } = props;
        this._axios = axios;
        this._cacheDbService = await makeCacheDbService;
        this._fx = money;
        this._currency = currency;
        return this;
    };
}
exports.ExchangeRateHandler = ExchangeRateHandler;
