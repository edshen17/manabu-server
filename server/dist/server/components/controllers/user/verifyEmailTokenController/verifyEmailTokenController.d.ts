import { VerifyEmailTokenUsecaseResponse } from '../../../usecases/user/verifyEmailTokenUsecase/verifyEmailTokenUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';
declare class VerifyEmailTokenController extends AbstractController<VerifyEmailTokenUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { VerifyEmailTokenController };
