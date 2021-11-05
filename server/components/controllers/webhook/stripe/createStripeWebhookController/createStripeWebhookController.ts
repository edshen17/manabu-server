import { CreateStripeWebhookUsecaseResponse } from '../../../../usecases/webhook/stripe/createStripeWebhookUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';

class CreateStripeWebhookController extends AbstractController<CreateStripeWebhookUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreateStripeWebhookController };
