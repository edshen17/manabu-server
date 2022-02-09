import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { WebhookHandler, WebhookHandlerCreateResourceResponse } from '../../utils/webhookHandler/webhookHandler';
declare type OptionalCreatePaynowWebhookUsecaseInitParams = {
    makeWebhookHandler: Promise<WebhookHandler>;
};
declare type CreatePaynowWebhookUsecaseResponse = WebhookHandlerCreateResourceResponse;
declare class CreatePaynowWebhookUsecase extends AbstractCreateUsecase<OptionalCreatePaynowWebhookUsecaseInitParams, CreatePaynowWebhookUsecaseResponse, unknown> {
    private _webhookHandler;
    protected _isProtectedResource: () => boolean;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreatePaynowWebhookUsecaseResponse>;
    protected _initTemplate: (optionalInitParams: OptionalCreatePaynowWebhookUsecaseInitParams) => Promise<void>;
}
export { CreatePaynowWebhookUsecase, CreatePaynowWebhookUsecaseResponse };
