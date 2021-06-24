import { LoginUserUsecaseResponse } from '../../../usecases/user/loginUserUsecase/loginUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';

class LoginUserController
  extends AbstractController<LoginUserUsecaseResponse>
  implements IController<LoginUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { LoginUserController };
