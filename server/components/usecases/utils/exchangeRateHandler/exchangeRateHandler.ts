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

  public getRates = async (): Promise<StringKeyObject> => {
    const cacheKey = {
      hashKey: 'exchangeRate',
      key: 'latest',
    };
    const exchangeRateAPIUrl = this._getExchangeRateAPIUrl();
    let cachedExchangeRates = await this._cacheDbService.get(cacheKey);
    if (!cachedExchangeRates) {
      const latestExchangeRatesRes: OpenExchangeRateResponse = (
        await this._axios.get(exchangeRateAPIUrl)
      ).data;
      cachedExchangeRates = await this._cacheDbService.set({
        ...cacheKey,
        value: latestExchangeRatesRes.rates,
        ttlMs: TTL_MS.DAY,
      });
    }
    return cachedExchangeRates;
  };

  private _getExchangeRateAPIUrl = () => {
    let apiKey;
    if (process.env.NODE_ENV == 'production') {
      apiKey = process.env.OPEN_EXCHANGE_RATE_API_KEY;
    } else {
      apiKey = process.env.OPEN_EXCHANGE_RATE_API_KEY_DEV;
    }
    return `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
  };

  public init = async (props: {
    axios: any;
    makeCacheDbService: Promise<CacheDbService>;
  }): Promise<this> => {
    const { axios, makeCacheDbService } = props;
    this._axios = axios;
    this._cacheDbService = await makeCacheDbService;
    return this;
  };
}

export { ExchangeRateHandler };
