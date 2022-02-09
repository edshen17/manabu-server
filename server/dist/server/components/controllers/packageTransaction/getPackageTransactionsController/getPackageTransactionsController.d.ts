import { GetPackageTransactionsUsecaseResponse } from '../../../usecases/packageTransaction/getPackageTransactionsUsecase/getPackageTransactionsUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class GetPackageTransactionsController extends AbstractController<GetPackageTransactionsUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { GetPackageTransactionsController };
