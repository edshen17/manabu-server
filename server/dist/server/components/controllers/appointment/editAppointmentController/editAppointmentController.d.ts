import { EditAppointmentUsecaseResponse } from '../../../usecases/appointment/editAppointmentUsecase/editAppointmentUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class EditAppointmentController extends AbstractController<EditAppointmentUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { EditAppointmentController };
