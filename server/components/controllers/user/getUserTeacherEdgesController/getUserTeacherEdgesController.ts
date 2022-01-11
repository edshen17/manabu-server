import { GetUserTeacherEdgesUsecaseResponse } from '../../../usecases/user/getUserTeacherEdgesUsecase/getUserTeacherEdgesUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetUserTeacherEdgesController extends AbstractController<GetUserTeacherEdgesUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetUserTeacherEdgesController };
