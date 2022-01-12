import { GetPendingTeachersUsecaseResponse } from '../../../usecases/teacher/getPendingTeachersUsecase/getPendingTeachersUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetPendingTeachersController extends AbstractController<GetPendingTeachersUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetPendingTeachersController };
