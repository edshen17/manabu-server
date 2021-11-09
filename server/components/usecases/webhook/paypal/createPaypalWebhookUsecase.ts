import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import {
  WebhookHandler,
  WebhookHandlerCreateResourceResponse,
} from '../../utils/webhookHandler/webhookHandler';

type OptionalCreatePaypalWebhookUsecaseInitParams = {
  makeWebhookHandler: Promise<WebhookHandler>;
};

type CreatePaypalWebhookUsecaseResponse = WebhookHandlerCreateResourceResponse;

class CreatePaypalWebhookUsecase extends AbstractCreateUsecase<
  OptionalCreatePaypalWebhookUsecaseInitParams,
  CreatePaypalWebhookUsecaseResponse,
  unknown
> {
  private _webhookHandler!: WebhookHandler;

  protected _isProtectedResource = (): boolean => {
    return false;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePaypalWebhookUsecaseResponse> => {
    const { body, currentAPIUser } = props;
    const { event_type, resource, id } = body;
    const { transactions } = resource;
    const token = transactions[0].custom;
    const paymentId = id;
    let usecaseRes: CreatePaypalWebhookUsecaseResponse = {};
    switch (event_type) {
      case 'PAYMENTS.PAYMENT.CREATED':
        usecaseRes = await this._webhookHandler.createResource({
          currentAPIUser,
          token,
          paymentId,
        });
        break;
      default:
        break;
    }
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePaypalWebhookUsecaseInitParams
  ): Promise<void> => {
    const { makeWebhookHandler } = optionalInitParams;
    this._webhookHandler = await makeWebhookHandler;
  };
}

export { CreatePaypalWebhookUsecase, CreatePaypalWebhookUsecaseResponse };
