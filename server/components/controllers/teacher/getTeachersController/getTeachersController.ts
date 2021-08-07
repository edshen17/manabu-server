import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { GetTeachersUsecaseResponse } from '../../../usecases/teacher/getTeachersUsecase/getTeachersUsecase';

class GetTeachersController extends AbstractController<GetTeachersUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetTeachersController };
