import { CreatePackageTransactionCheckoutUsecaseResponse } from '../../../../usecases/checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';
declare class CreatePackageTransactionCheckoutController extends AbstractController<CreatePackageTransactionCheckoutUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreatePackageTransactionCheckoutController };
