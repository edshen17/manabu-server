import { EditUserUsecaseResponse } from '../../../usecases/user/editUserUsecase/editUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

type EditTeacherUsecaseResponse = EditUserUsecaseResponse;

class EditTeacherController extends AbstractController<EditTeacherUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { EditTeacherController };
