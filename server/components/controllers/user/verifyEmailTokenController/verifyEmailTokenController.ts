import { VerifyEmailTokenUsecaseResponse } from '../../../usecases/user/verifyEmailTokenUsecase/verifyEmailTokenUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class VerifyEmailTokenController extends AbstractController<VerifyEmailTokenUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { VerifyEmailTokenController };
