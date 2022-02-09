import { LoginUserUsecaseResponse } from '../../../usecases/user/loginUserUsecase/loginUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class LoginUserController extends AbstractController<LoginUserUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { LoginUserController };
