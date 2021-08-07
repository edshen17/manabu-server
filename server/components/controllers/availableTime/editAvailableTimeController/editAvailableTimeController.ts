import { EditAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/editAvailableTimeUsecase/editAvailableTimeUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class EditAvailableTimeController extends AbstractController<EditAvailableTimeUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { EditAvailableTimeController };
