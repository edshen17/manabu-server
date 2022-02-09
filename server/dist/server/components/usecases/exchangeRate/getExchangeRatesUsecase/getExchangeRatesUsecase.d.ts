/// <reference types="custom" />
import { StringKeyObject } from '../../../../types/custom';
import { StubDbServiceResponse } from '../../../dataAccess/services/stub/stubDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ExchangeRateHandler } from '../../utils/exchangeRateHandler/exchangeRateHandler';
declare type OptionalGetExchangeRatesUsecaseInitParams = {
    makeExchangeRateHandler: Promise<ExchangeRateHandler>;
};
declare type GetExchangeRatesUsecaseResponse = {
    exchangeRates: StringKeyObject;
};
declare class GetExchangeRatesUsecase extends AbstractGetUsecase<OptionalGetExchangeRatesUsecaseInitParams, GetExchangeRatesUsecaseResponse, StubDbServiceResponse> {
    private _exchangeRateHandler;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetExchangeRatesUsecaseResponse>;
    protected _initTemplate: (optionalInitParams: OptionalGetExchangeRatesUsecaseInitParams) => Promise<void>;
}
export { GetExchangeRatesUsecase, GetExchangeRatesUsecaseResponse };
