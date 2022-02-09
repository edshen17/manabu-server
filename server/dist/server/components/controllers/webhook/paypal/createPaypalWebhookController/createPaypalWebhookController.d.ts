import { CreatePaypalWebhookUsecaseResponse } from '../../../../usecases/webhook/paypal/createPaypalWebhookUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';
declare class CreatePaypalWebhookController extends AbstractController<CreatePaypalWebhookUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreatePaypalWebhookController };
