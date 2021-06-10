import { PutUserUsecaseResponse } from '../../usecases/user/putUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PutUserController
  extends AbstractController<PutUserUsecaseResponse>
  implements IController<PutUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PutUserController };
