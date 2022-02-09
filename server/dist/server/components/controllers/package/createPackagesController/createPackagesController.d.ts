import { CreatePackagesUsecaseResponse } from '../../../usecases/package/createPackagesUsecase/createPackagesUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class CreatePackagesController extends AbstractController<CreatePackagesUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreatePackagesController };
