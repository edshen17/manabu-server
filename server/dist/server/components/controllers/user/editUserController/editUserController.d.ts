import { EditUserUsecaseResponse } from '../../../usecases/user/editUserUsecase/editUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class EditUserController extends AbstractController<EditUserUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { EditUserController };
