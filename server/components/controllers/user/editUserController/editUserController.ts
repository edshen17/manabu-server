import { EditUserUsecaseResponse } from '../../../usecases/user/editUserUsecase/editUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';

class EditUserController
  extends AbstractController<EditUserUsecaseResponse>
  implements IController<EditUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { EditUserController };
