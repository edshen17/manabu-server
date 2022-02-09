import Stripe from 'stripe';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { WebhookHandler, WebhookHandlerCreateResourceResponse } from '../../utils/webhookHandler/webhookHandler';
declare type OptionalCreateStripeWebhookUsecaseInitParams = {
    stripe: Stripe;
    makeWebhookHandler: Promise<WebhookHandler>;
};
declare type CreateStripeWebhookUsecaseResponse = WebhookHandlerCreateResourceResponse;
declare class CreateStripeWebhookUsecase extends AbstractCreateUsecase<OptionalCreateStripeWebhookUsecaseInitParams, CreateStripeWebhookUsecaseResponse, unknown> {
    private _stripe;
    private _webhookHandler;
    protected _isProtectedResource: () => boolean;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreateStripeWebhookUsecaseResponse>;
    private _getStripeEvent;
    protected _initTemplate: (optionalInitParams: OptionalCreateStripeWebhookUsecaseInitParams) => Promise<void>;
}
export { CreateStripeWebhookUsecase, CreateStripeWebhookUsecaseResponse };
