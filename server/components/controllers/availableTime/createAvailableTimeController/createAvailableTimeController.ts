import { CreateAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/createAvailableTimeUsecase/createAvailableTimeUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class CreateAvailableTimeController extends AbstractController<CreateAvailableTimeUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreateAvailableTimeController };
