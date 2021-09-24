import { GetAppointmentUsecaseResponse } from '../../../usecases/appointment/getAppointmentUsecase/getAppointmentUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetAppointmentController extends AbstractController<GetAppointmentUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetAppointmentController };
