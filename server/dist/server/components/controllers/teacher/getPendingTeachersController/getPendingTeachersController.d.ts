import { GetPendingTeachersUsecaseResponse } from '../../../usecases/teacher/getPendingTeachersUsecase/getPendingTeachersUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetPendingTeachersController extends AbstractController<GetPendingTeachersUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetPendingTeachersController };
