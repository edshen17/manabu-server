import { CreateOcrContentsUsecaseResponse } from '../../../usecases/content/createOcrContentsUsecase/createOcrContentsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class CreateOcrContentsController extends AbstractController<CreateOcrContentsUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreateOcrContentsController };
