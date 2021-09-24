import { EditAppointmentUsecaseResponse } from '../../../usecases/appointment/editAppointmentUsecase/editAppointmentUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class EditAppointmentController extends AbstractController<EditAppointmentUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { EditAppointmentController };
