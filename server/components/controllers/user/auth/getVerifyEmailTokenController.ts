import { GetVerifyEmailTokenUsecaseResponse } from '../../../usecases/user/auth/getVerifyEmailTokenUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';

class GetVerifyEmailTokenController
  extends AbstractController<GetVerifyEmailTokenUsecaseResponse>
  implements IController<GetVerifyEmailTokenUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetVerifyEmailTokenController };
