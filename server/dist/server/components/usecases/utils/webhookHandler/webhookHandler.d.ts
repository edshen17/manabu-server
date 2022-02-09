import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { ConvertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { CreatePackageTransactionUsecase } from '../../packageTransaction/createPackageTransactionUsecase/createPackageTransactionUsecase';
import { ControllerDataBuilder } from '../controllerDataBuilder/controllerDataBuilder';
declare type WebhookHandlerCreateResourceParams = {
    token: string;
    currentAPIUser: CurrentAPIUser;
    paymentId: string;
};
declare type WebhookHandlerCreateResourceResponse = {
    packageTransaction?: PackageTransactionDoc;
};
declare class WebhookHandler {
    private _controllerDataBuilder;
    private _createPackageTransactionUsecase;
    private _convertStringToObjectId;
    createResource: (props: WebhookHandlerCreateResourceParams) => Promise<WebhookHandlerCreateResourceResponse>;
    private _createPackageTransaction;
    init: (initParams: {
        makeCreatePackageTransactionUsecase: Promise<CreatePackageTransactionUsecase>;
        makeControllerDataBuilder: ControllerDataBuilder;
        convertStringToObjectId: ConvertStringToObjectId;
    }) => Promise<this>;
}
export { WebhookHandler, WebhookHandlerCreateResourceParams, WebhookHandlerCreateResourceResponse };
