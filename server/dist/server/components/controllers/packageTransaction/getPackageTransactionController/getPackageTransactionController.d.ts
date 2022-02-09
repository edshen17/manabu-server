import { GetPackageTransactionUsecaseResponse } from '../../../usecases/packageTransaction/getPackageTransactionUsecase/getPackageTransactionUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetPackageTransactionController extends AbstractController<GetPackageTransactionUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetPackageTransactionController };
