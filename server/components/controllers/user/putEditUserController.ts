import { EditUserUsecaseResponse } from '../../usecases/user/editUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PutEditUserController
  extends AbstractController<EditUserUsecaseResponse>
  implements IController<EditUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PutEditUserController };
