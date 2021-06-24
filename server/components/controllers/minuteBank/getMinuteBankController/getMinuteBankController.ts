import { GetMinuteBankUsecaseResponse } from '../../../usecases/minuteBank/getMinuteBankUsecase/getMinuteBankUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';

class GetMinuteBankController
  extends AbstractController<GetMinuteBankUsecaseResponse>
  implements IController<GetMinuteBankUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetMinuteBankController };
