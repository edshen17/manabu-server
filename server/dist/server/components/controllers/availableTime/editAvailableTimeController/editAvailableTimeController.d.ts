import { EditAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/editAvailableTimeUsecase/editAvailableTimeUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class EditAvailableTimeController extends AbstractController<EditAvailableTimeUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { EditAvailableTimeController };
