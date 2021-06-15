import { VerifyEmailTokenUsecaseResponse } from '../../../usecases/user/auth/verifyEmailTokenUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';

class GetVerifyEmailTokenController
  extends AbstractController<VerifyEmailTokenUsecaseResponse>
  implements IController<VerifyEmailTokenUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetVerifyEmailTokenController };
