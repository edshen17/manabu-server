import { CreateUserUsecaseResponse } from '../../../usecases/user/createUserUsecase/createUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class CreateUserController extends AbstractController<CreateUserUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreateUserController };
