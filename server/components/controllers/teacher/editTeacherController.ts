import { EditUserUsecaseResponse } from '../../usecases/user/editUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

type EditTeacherUsecaseResponse = EditUserUsecaseResponse;

class EditTeacherController
  extends AbstractController<EditTeacherUsecaseResponse>
  implements IController<EditTeacherUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { EditTeacherController };
