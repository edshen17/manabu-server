import { CreateAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/createAvailableTimeUsecase/createAvailableTimeUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';

class CreateAvailableTimeController
  extends AbstractController<CreateAvailableTimeUsecaseResponse>
  implements IController<CreateAvailableTimeUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreateAvailableTimeController };
