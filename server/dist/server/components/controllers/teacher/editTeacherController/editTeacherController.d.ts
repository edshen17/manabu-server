import { EditUserUsecaseResponse } from '../../../usecases/user/editUserUsecase/editUserUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare type EditTeacherUsecaseResponse = EditUserUsecaseResponse;
declare class EditTeacherController extends AbstractController<EditTeacherUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { EditTeacherController };
