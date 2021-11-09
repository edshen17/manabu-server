import { CreatePaypalWebhookUsecaseResponse } from '../../../../usecases/webhook/paypal/createPaypalWebhookUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';

class CreatePaypalWebhookController extends AbstractController<CreatePaypalWebhookUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreatePaypalWebhookController };
