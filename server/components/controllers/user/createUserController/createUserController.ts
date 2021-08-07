import { CreateUserUsecaseResponse } from '../../../usecases/user/createUserUsecase/createUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class CreateUserController extends AbstractController<CreateUserUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreateUserController };
