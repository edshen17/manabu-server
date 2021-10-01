import { GetExchangeRatesUsecaseResponse } from '../../../usecases/exchangeRate/getExchangeRatesUsecase/getExchangeRatesUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetExchangeRatesController extends AbstractController<GetExchangeRatesUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetExchangeRatesController };
