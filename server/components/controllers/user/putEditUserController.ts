import { PutEditUserUsecaseResponse } from '../../usecases/user/putEditUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PutEditUserController
  extends AbstractController<PutEditUserUsecaseResponse>
  implements IController<PutEditUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PutEditUserController };
