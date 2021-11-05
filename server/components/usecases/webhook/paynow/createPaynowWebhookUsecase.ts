import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import {
  WebhookHandler,
  WebhookHandlerCreateResourceResponse,
} from '../../utils/webhookHandler/webhookHandler';

type OptionalCreatePaynowWebhookUsecaseInitParams = {
  makeWebhookHandler: Promise<WebhookHandler>;
};

type CreatePaynowWebhookUsecaseResponse = WebhookHandlerCreateResourceResponse;

class CreatePaynowWebhookUsecase extends AbstractCreateUsecase<
  OptionalCreatePaynowWebhookUsecaseInitParams,
  CreatePaynowWebhookUsecaseResponse,
  unknown
> {
  private _webhookHandler!: WebhookHandler;

  protected _isProtectedResource = (): boolean => {
    return false;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePaynowWebhookUsecaseResponse> => {
    const { body, currentAPIUser } = props;
    const { key, data } = body;
    const { metadata, id } = data;
    const { token } = metadata;
    const paymentId: string = id;
    let usecaseRes: CreatePaynowWebhookUsecaseResponse = {};
    switch (key) {
      case 'charge.complete':
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
    optionalInitParams: OptionalCreatePaynowWebhookUsecaseInitParams
  ): Promise<void> => {
    const { makeWebhookHandler } = optionalInitParams;
    this._webhookHandler = await makeWebhookHandler;
  };
}

export { CreatePaynowWebhookUsecase, CreatePaynowWebhookUsecaseResponse };
