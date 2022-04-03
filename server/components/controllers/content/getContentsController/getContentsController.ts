import { GetContentsUsecaseResponse } from '../../../usecases/content/getContentsUsecase/getContentsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetContentsController extends AbstractController<GetContentsUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetContentsController };
