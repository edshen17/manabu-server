import { CreateStripeWebhookUsecaseResponse } from '../../../../usecases/webhook/stripe/createStripeWebhookUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';
declare class CreateStripeWebhookController extends AbstractController<CreateStripeWebhookUsecaseResponse> {
    constructor(props: ControllerParams);
}
export { CreateStripeWebhookController };
