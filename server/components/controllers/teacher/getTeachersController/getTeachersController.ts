import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
import { IController } from '../../abstractions/IController';
import { GetTeachersUsecaseResponse } from '../../../usecases/teacher/getTeachersUsecase/getTeachersUsecase';

class GetTeachersController
  extends AbstractController<GetTeachersUsecaseResponse>
  implements IController<GetTeachersUsecaseResponse>
{
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetTeachersController };
