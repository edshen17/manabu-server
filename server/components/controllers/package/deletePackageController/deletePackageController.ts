import { DeletePackageUsecaseResponse } from '../../../usecases/package/deletePackageUsecase/deletePackageUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class DeletePackageController extends AbstractController<DeletePackageUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { DeletePackageController };
