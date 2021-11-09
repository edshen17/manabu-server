import { GetPackageTransactionUsecaseResponse } from '../../../usecases/packageTransaction/getPackageTransactionUsecase/getPackageTransactionUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetPackageTransactionController extends AbstractController<GetPackageTransactionUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetPackageTransactionController };
