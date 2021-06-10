import { PostUserUsecaseResponse } from '../../usecases/user/postUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PostUserController
  extends AbstractController<PostUserUsecaseResponse>
  implements IController<PostUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PostUserController };
