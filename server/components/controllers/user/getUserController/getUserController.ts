import { GetUserUsecaseResponse } from '../../../usecases/user/getUserUsecase/getUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetUserController extends AbstractController<GetUserUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetUserController };
