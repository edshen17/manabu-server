import { PostCreateUserUsecaseResponse } from '../../usecases/user/postCreateUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PostCreateUserController
  extends AbstractController<PostCreateUserUsecaseResponse>
  implements IController<PostCreateUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PostCreateUserController };
