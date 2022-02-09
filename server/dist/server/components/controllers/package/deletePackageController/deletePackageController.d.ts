import { DeletePackageUsecaseResponse } from '../../../usecases/package/deletePackageUsecase/deletePackageUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class DeletePackageController extends AbstractController<DeletePackageUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { DeletePackageController };
