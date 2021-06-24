import { VerifyEmailTokenUsecaseResponse } from '../../../usecases/user/verifyEmailTokenUsecase/verifyEmailTokenUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';

class VerifyEmailTokenController
  extends AbstractController<VerifyEmailTokenUsecaseResponse>
  implements IController<VerifyEmailTokenUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { VerifyEmailTokenController };
