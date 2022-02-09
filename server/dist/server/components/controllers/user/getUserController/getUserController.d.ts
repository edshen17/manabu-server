import { GetUserUsecaseResponse } from '../../../usecases/user/getUserUsecase/getUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetUserController extends AbstractController<GetUserUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetUserController };
