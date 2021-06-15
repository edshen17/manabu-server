import { CreateUserUsecaseResponse } from '../../usecases/user/createUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PostCreateUserController
  extends AbstractController<CreateUserUsecaseResponse>
  implements IController<CreateUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PostCreateUserController };
