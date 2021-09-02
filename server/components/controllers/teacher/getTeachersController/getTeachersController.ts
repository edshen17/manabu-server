import { GetTeachersUsecaseResponse } from '../../../usecases/teacher/getTeachersUsecase/getTeachersUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetTeachersController extends AbstractController<GetTeachersUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetTeachersController };
