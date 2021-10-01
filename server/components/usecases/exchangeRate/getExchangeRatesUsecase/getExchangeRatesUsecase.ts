import { StringKeyObject } from '../../../../types/custom';
import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetExchangeRatesUsecaseInitParams = {
  makeCacheDbService: Promise<CacheDbService>;
  axios: any;
};

type GetExchangeRatesUsecaseResponse = { exchangeRates: StringKeyObject };

type OpenExchangeRateResponse = {
  disclaimer: string;
  license: string;
  timestamp: Date;
  base: string;
  rates: StringKeyObject;
};

class GetExchangeRatesUsecase extends AbstractGetUsecase<
  OptionalGetExchangeRatesUsecaseInitParams,
  GetExchangeRatesUsecaseResponse,
  any
> {
  private _cacheDbService!: CacheDbService;
  private _axios!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetExchangeRatesUsecaseResponse> => {
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
    return { exchangeRates: cachedExchangeRates };
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

  protected _initTemplate = async (
    optionalInitParams: OptionalGetExchangeRatesUsecaseInitParams
  ): Promise<void> => {
    const { axios, makeCacheDbService } = optionalInitParams;
    this._axios = axios;
    this._cacheDbService = await makeCacheDbService;
  };
}

export { GetExchangeRatesUsecase, GetExchangeRatesUsecaseResponse };
