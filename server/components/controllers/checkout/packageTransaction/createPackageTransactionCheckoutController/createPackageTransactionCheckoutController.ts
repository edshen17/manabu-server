import { CreatePackageTransactionCheckoutUsecaseResponse } from '../../../../usecases/checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';

class CreatePackageTransactionCheckoutController extends AbstractController<CreatePackageTransactionCheckoutUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreatePackageTransactionCheckoutController };
