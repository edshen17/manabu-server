import { DeleteAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/deleteAvailableTimeUsecase/deleteAvailableTimeUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class DeleteAvailableTimeController extends AbstractController<DeleteAvailableTimeUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { DeleteAvailableTimeController };
