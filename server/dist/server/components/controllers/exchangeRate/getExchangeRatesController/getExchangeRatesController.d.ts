import { GetExchangeRatesUsecaseResponse } from '../../../usecases/exchangeRate/getExchangeRatesUsecase/getExchangeRatesUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetExchangeRatesController extends AbstractController<GetExchangeRatesUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetExchangeRatesController };
