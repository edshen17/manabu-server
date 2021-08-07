import { LoginUserUsecaseResponse } from '../../../usecases/user/loginUserUsecase/loginUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class LoginUserController extends AbstractController<LoginUserUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { LoginUserController };
