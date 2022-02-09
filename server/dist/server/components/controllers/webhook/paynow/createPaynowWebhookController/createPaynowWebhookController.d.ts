import { CreatePaynowWebhookUsecaseResponse } from '../../../../usecases/webhook/paynow/createPaynowWebhookUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';
declare class CreatePaynowWebhookController extends AbstractController<CreatePaynowWebhookUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreatePaynowWebhookController };
