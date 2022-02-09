import { GetAppointmentsUsecaseResponse } from '../../../usecases/appointment/getAppointmentsUsecase/getAppointmentsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetAppointmentsController extends AbstractController<GetAppointmentsUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetAppointmentsController };
