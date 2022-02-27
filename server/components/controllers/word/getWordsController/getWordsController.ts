import { GetWordsUsecaseResponse } from '../../../usecases/word/getWordsUsecase/getWordsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetWordsController extends AbstractController<GetWordsUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetWordsController };
