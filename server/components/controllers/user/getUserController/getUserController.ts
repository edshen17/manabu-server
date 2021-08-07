import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { GetUserUsecaseResponse } from '../../../usecases/user/getUserUsecase/getUserUsecase';

class GetUserController extends AbstractController<GetUserUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetUserController };
