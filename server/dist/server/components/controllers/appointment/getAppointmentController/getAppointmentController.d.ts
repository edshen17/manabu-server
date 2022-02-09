import { GetAppointmentUsecaseResponse } from '../../../usecases/appointment/getAppointmentUsecase/getAppointmentUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetAppointmentController extends AbstractController<GetAppointmentUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetAppointmentController };
