import { GetPackageTransactionsUsecaseResponse } from '../../../usecases/packageTransaction/getPackageTransactionsUsecase/getPackageTransactionsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetPackageTransactionsController extends AbstractController<GetPackageTransactionsUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetPackageTransactionsController };
