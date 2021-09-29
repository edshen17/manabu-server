import { EditPackageUsecaseResponse } from '../../../usecases/package/editPackageUsecase/editPackageUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class EditPackageController extends AbstractController<EditPackageUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { EditPackageController };
