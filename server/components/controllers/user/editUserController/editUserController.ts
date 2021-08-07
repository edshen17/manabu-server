import { EditUserUsecaseResponse } from '../../../usecases/user/editUserUsecase/editUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class EditUserController extends AbstractController<EditUserUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { EditUserController };
