import { Axios } from 'axios';
import {
  IS_PRODUCTION,
  OPEN_EXCHANGE_RATE_API_KEY,
  OPEN_EXCHANGE_RATE_API_KEY_DEV,
} from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';
import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';

type OpenExchangeRateResponse = {
  disclaimer: string;
  license: string;
  timestamp: Date;
  base: string;
  rates: StringKeyObject;
};

type ArithmeticCurrencyObj = {
  amount: number;
  sourceCurrency: string;
};

class ExchangeRateHandler {
  private _axios!: Axios;
  private _cacheDbService!: CacheDbService;
  private _fx!: any;
  private _currency!: any;

  public getRates = async (): Promise<StringKeyObject> => {
    const cacheKeys = {
      hashKey: 'exchangerate',
      key: 'latest',
    };
    const exchangeRateAPIUrl = this._getExchangeRateAPIUrl();
    let cachedExchangeRates = await this._cacheDbService.get(cacheKeys);
    if (!cachedExchangeRates) {
      const latestExchangeRatesRes: OpenExchangeRateResponse = (
        await this._axios.get(exchangeRateAPIUrl)
      ).data;
      cachedExchangeRates = await this._cacheDbService.set({
        ...cacheKeys,
        value: latestExchangeRatesRes.rates,
        ttlMs: TTL_MS.DAY,
      });
    }
    return cachedExchangeRates;
  };

  private _getExchangeRateAPIUrl = () => {
    let apiKey = OPEN_EXCHANGE_RATE_API_KEY_DEV;
    if (IS_PRODUCTION) {
      apiKey = OPEN_EXCHANGE_RATE_API_KEY;
    }
    return `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
  };

  public convert = async (props: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
  }): Promise<number> => {
    const { amount, sourceCurrency, targetCurrency } = props;
    this._fx.base = 'SGD';
    this._fx.rates = await this.getRates();
    const convertedAmount = this._fx(amount)
      .from(sourceCurrency.toUpperCase())
      .to(targetCurrency.toUpperCase());
    const formattedAmount = this.toCurrency(convertedAmount);
    return formattedAmount;
  };

  public add = async (props: {
    addend1: ArithmeticCurrencyObj;
    addend2: ArithmeticCurrencyObj;
    targetCurrency: string;
  }): Promise<number> => {
    const { addend1, addend2, targetCurrency } = props;
    const convertedAddend1 = await this.convert({
      amount: addend1.amount,
      sourceCurrency: addend1.sourceCurrency,
      targetCurrency,
    });
    const convertedAddend2 = await this.convert({
      amount: addend2.amount,
      sourceCurrency: addend2.sourceCurrency,
      targetCurrency,
    });
    const convertedSum = this._currency(convertedAddend1).add(convertedAddend2).value;
    return convertedSum;
  };

  public subtract = async (props: {
    minuend: ArithmeticCurrencyObj;
    subtrahend: ArithmeticCurrencyObj;
    targetCurrency: string;
  }): Promise<number> => {
    const { minuend, subtrahend, targetCurrency } = props;
    const convertedMinuend = await this.convert({
      amount: minuend.amount,
      sourceCurrency: minuend.sourceCurrency,
      targetCurrency,
    });
    const convertedSubtrahend = await this.convert({
      amount: subtrahend.amount,
      sourceCurrency: subtrahend.sourceCurrency,
      targetCurrency,
    });
    const convertedDiff = this._currency(convertedMinuend).subtract(convertedSubtrahend).value;
    return convertedDiff;
  };

  public multiply = async (props: {
    multiplicand: ArithmeticCurrencyObj;
    multiplier: ArithmeticCurrencyObj;
    targetCurrency: string;
  }): Promise<number> => {
    const { multiplicand, multiplier, targetCurrency } = props;
    const convertedMultiplicand = await this.convert({
      amount: multiplicand.amount,
      sourceCurrency: multiplicand.sourceCurrency,
      targetCurrency,
    });
    const convertedMultiplier = await this.convert({
      amount: multiplier.amount,
      sourceCurrency: multiplier.sourceCurrency,
      targetCurrency,
    });
    const convertedDiff = this._currency(convertedMultiplicand).multiply(convertedMultiplier).value;
    return convertedDiff;
  };

  public toCurrency = (num: number): number => {
    const convertedNum = this._currency(num).value;
    return convertedNum;
  };

  public init = async (props: {
    axios: Axios;
    makeCacheDbService: Promise<CacheDbService>;
    money: any;
    currency: any;
  }): Promise<this> => {
    const { axios, makeCacheDbService, money, currency } = props;
    this._axios = axios;
    this._cacheDbService = await makeCacheDbService;
    this._fx = money;
    this._currency = currency;
    return this;
  };
}

export { ExchangeRateHandler };
