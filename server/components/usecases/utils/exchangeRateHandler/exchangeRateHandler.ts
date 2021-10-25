import { StringKeyObject } from '../../../../types/custom';
import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';

type OpenExchangeRateResponse = {
  disclaimer: string;
  license: string;
  timestamp: Date;
  base: string;
  rates: StringKeyObject;
};

class ExchangeRateHandler {
  private _axios!: any;
  private _cacheDbService!: CacheDbService;
  private _fx!: any;
  private _currency!: any;

  public getRates = async (): Promise<StringKeyObject> => {
    const cacheKeys = {
      hashKey: 'exchangeRate',
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
    let apiKey = process.env.OPEN_EXCHANGE_RATE_API_KEY_DEV;
    if (process.env.NODE_ENV == 'production') {
      apiKey = process.env.OPEN_EXCHANGE_RATE_API_KEY;
    }
    return `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
  };

  public convert = async (props: {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
  }): Promise<number> => {
    const { amount, fromCurrency, toCurrency } = props;
    this._fx.base = 'SGD';
    this._fx.rates = await this.getRates();
    const convertedAmount = this._fx(amount)
      .from(fromCurrency.toUpperCase())
      .to(toCurrency.toUpperCase());
    const formattedAmount = this._currency(convertedAmount).value;
    return formattedAmount;
  };

  public init = async (props: {
    axios: any;
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
