import { CreateAppointmentsUsecaseResponse } from '../../../usecases/appointment/createAppointmentsUsecase/createAppointmentsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class CreateAppointmentsController extends AbstractController<CreateAppointmentsUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreateAppointmentsController };
