import { CreateAppointmentsUsecaseResponse } from '../../../usecases/appointment/createAppointmentsUsecase/createAppointmentsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class CreateAppointmentsController extends AbstractController<CreateAppointmentsUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreateAppointmentsController };
