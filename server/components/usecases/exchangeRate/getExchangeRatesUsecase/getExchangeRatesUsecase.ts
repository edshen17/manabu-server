import { StringKeyObject } from '../../../../types/custom';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ExchangeRateHandler } from '../../utils/exchangeRateHandler/exchangeRateHandler';

type OptionalGetExchangeRatesUsecaseInitParams = {
  makeExchangeRateHandler: Promise<ExchangeRateHandler>;
};

type GetExchangeRatesUsecaseResponse = { exchangeRates: StringKeyObject };

class GetExchangeRatesUsecase extends AbstractGetUsecase<
  OptionalGetExchangeRatesUsecaseInitParams,
  GetExchangeRatesUsecaseResponse,
  undefined
> {
  private _exchangeRateHandler!: ExchangeRateHandler;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetExchangeRatesUsecaseResponse> => {
    const exchangeRates = await this._exchangeRateHandler.getRates();
    return { exchangeRates };
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetExchangeRatesUsecaseInitParams
  ): Promise<void> => {
    const { makeExchangeRateHandler } = optionalInitParams;
    this._exchangeRateHandler = await makeExchangeRateHandler;
  };
}

export { GetExchangeRatesUsecase, GetExchangeRatesUsecaseResponse };
