import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';
import { GetUserUsecaseResponse } from '../../../usecases/user/getUserUsecase/getUserUsecase';

class GetUserController
  extends AbstractController<GetUserUsecaseResponse>
  implements IController<GetUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetUserController };
