import { GetTeachersUsecaseResponse } from '../../../usecases/teacher/getTeachersUsecase/getTeachersUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetTeachersController extends AbstractController<GetTeachersUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetTeachersController };
