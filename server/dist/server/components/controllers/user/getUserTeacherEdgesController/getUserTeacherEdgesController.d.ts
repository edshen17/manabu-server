import { GetUserTeacherEdgesUsecaseResponse } from '../../../usecases/user/getUserTeacherEdgesUsecase/getUserTeacherEdgesUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetUserTeacherEdgesController extends AbstractController<GetUserTeacherEdgesUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetUserTeacherEdgesController };
