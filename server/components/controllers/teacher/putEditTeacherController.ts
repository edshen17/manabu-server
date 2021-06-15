import { PutEditUserUsecaseResponse } from '../../usecases/user/putEditUserUsecase';
import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PutEditTeacherController
  extends AbstractController<PutEditUserUsecaseResponse>
  implements IController<PutEditUserUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PutEditTeacherController };
