import { CreatePackagesUsecaseResponse } from '../../../usecases/package/createPackagesUsecase/createPackagesUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class CreatePackagesController extends AbstractController<CreatePackagesUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreatePackagesController };
