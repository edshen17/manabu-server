import { CreateAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/createAvailableTimeUsecase/createAvailableTimeUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class CreateAvailableTimeController extends AbstractController<CreateAvailableTimeUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreateAvailableTimeController };
