import Stripe from 'stripe';
import {
  IS_PRODUCTION,
  STRIPE_WEBHOOK_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET_KEY_DEV,
} from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import {
  WebhookHandler,
  WebhookHandlerCreateResourceResponse,
} from '../../utils/webhookHandler/webhookHandler';

type OptionalCreateStripeWebhookUsecaseInitParams = {
  stripe: Stripe;
  makeWebhookHandler: Promise<WebhookHandler>;
};

type CreateStripeWebhookUsecaseResponse = WebhookHandlerCreateResourceResponse;

class CreateStripeWebhookUsecase extends AbstractCreateUsecase<
  OptionalCreateStripeWebhookUsecaseInitParams,
  CreateStripeWebhookUsecaseResponse,
  unknown
> {
  private _stripe!: Stripe;
  private _webhookHandler!: WebhookHandler;

  protected _isProtectedResource = (): boolean => {
    return false;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateStripeWebhookUsecaseResponse> => {
    const { rawBody, headers, currentAPIUser } = props;
    const stripeEvent = this._getStripeEvent({ rawBody, headers });
    const stripeEventType = stripeEvent.type;
    const stripeEventObj = (stripeEvent as StringKeyObject).data.object;
    const token: string = stripeEventObj.charges.data[0].metadata.token;
    const paymentId: string = stripeEventObj.id;
    let usecaseRes: CreateStripeWebhookUsecaseResponse = {};
    switch (stripeEventType) {
      case 'payment_intent.succeeded':
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

  private _getStripeEvent = (props: {
    rawBody?: StringKeyObject;
    headers: StringKeyObject;
  }): Stripe.Event => {
    const { headers, rawBody } = props;
    const { payloadString } = rawBody || {};
    const sig = headers['stripe-signature'];
    let webhookSecret = STRIPE_WEBHOOK_SECRET_KEY_DEV;
    let constructEventBody = payloadString || rawBody;
    if (IS_PRODUCTION) {
      webhookSecret = STRIPE_WEBHOOK_SECRET_KEY;
      constructEventBody = rawBody;
    }
    const event = this._stripe.webhooks.constructEvent(constructEventBody, sig, webhookSecret);
    return event;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateStripeWebhookUsecaseInitParams
  ): Promise<void> => {
    const { stripe, makeWebhookHandler } = optionalInitParams;
    this._stripe = stripe;
    this._webhookHandler = await makeWebhookHandler;
  };
}

export { CreateStripeWebhookUsecase, CreateStripeWebhookUsecaseResponse };
