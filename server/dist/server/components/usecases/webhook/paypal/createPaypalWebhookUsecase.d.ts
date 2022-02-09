import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { WebhookHandler, WebhookHandlerCreateResourceResponse } from '../../utils/webhookHandler/webhookHandler';
declare type OptionalCreatePaypalWebhookUsecaseInitParams = {
    makeWebhookHandler: Promise<WebhookHandler>;
};
declare type CreatePaypalWebhookUsecaseResponse = WebhookHandlerCreateResourceResponse;
declare class CreatePaypalWebhookUsecase extends AbstractCreateUsecase<OptionalCreatePaypalWebhookUsecaseInitParams, CreatePaypalWebhookUsecaseResponse, unknown> {
    private _webhookHandler;
    protected _isProtectedResource: () => boolean;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreatePaypalWebhookUsecaseResponse>;
    protected _initTemplate: (optionalInitParams: OptionalCreatePaypalWebhookUsecaseInitParams) => Promise<void>;
}
export { CreatePaypalWebhookUsecase, CreatePaypalWebhookUsecaseResponse };
