import { EditPackageUsecaseResponse } from '../../../usecases/package/editPackageUsecase/editPackageUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class EditPackageController extends AbstractController<EditPackageUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { EditPackageController };
