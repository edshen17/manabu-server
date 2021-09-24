import { GetAppointmentsUsecaseResponse } from '../../../usecases/appointment/getAppointmentsUsecase/getAppointmentsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetAppointmentsController extends AbstractController<GetAppointmentsUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetAppointmentsController };
