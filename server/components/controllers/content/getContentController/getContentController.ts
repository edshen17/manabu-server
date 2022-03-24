import { GetContentUsecaseResponse } from '../../../usecases/content/getContentUsecase/getContentUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetContentController extends AbstractController<GetContentUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetContentController };
