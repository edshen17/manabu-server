import { DeleteAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/deleteAvailableTimeUsecase/deleteAvailableTimeUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class DeleteAvailableTimeController extends AbstractController<DeleteAvailableTimeUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { DeleteAvailableTimeController };
