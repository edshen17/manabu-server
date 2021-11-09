import { CreatePaynowWebhookUsecaseResponse } from '../../../../usecases/webhook/paynow/createPaynowWebhookUsecase';
import { AbstractController, ControllerParams } from '../../../abstractions/AbstractController';

class CreatePaynowWebhookController extends AbstractController<CreatePaynowWebhookUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { CreatePaynowWebhookController };
