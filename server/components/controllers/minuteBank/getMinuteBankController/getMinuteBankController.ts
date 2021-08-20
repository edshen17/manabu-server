import { GetMinuteBankUsecaseResponse } from '../../../usecases/minuteBank/getMinuteBankUsecase/getMinuteBankUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetMinuteBankController extends AbstractController<GetMinuteBankUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetMinuteBankController };
