import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DB_SERVICE_COLLECTION } from '../../../dataAccess/abstractions/IDbService';
import { ConvertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { CreatePackageTransactionUsecase } from '../../packageTransaction/createPackageTransactionUsecase/createPackageTransactionUsecase';
import { ControllerDataBuilder } from '../controllerDataBuilder/controllerDataBuilder';

type WebhookHandlerCreateResourceParams = {
  token: string;
  currentAPIUser: CurrentAPIUser;
  paymentId: string;
};

type WebhookHandlerCreateResourceResponse = {
  packageTransaction?: PackageTransactionDoc;
};

class WebhookHandler {
  private _controllerDataBuilder!: ControllerDataBuilder;
  private _createPackageTransactionUsecase!: CreatePackageTransactionUsecase;
  private _convertStringToObjectId!: ConvertStringToObjectId;

  public createResource = async (
    props: WebhookHandlerCreateResourceParams
  ): Promise<WebhookHandlerCreateResourceResponse> => {
    const { token } = props;
    const tokenArr = token.split('-');
    const userId = this._convertStringToObjectId(tokenArr[0]);
    const resourceName = tokenArr[1];
    let usecaseRes: WebhookHandlerCreateResourceResponse = {};
    switch (resourceName) {
      case DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS:
        usecaseRes = await this._createPackageTransaction({ ...props, userId });
        break;
      default:
        break;
    }
    return usecaseRes;
  };

  private _createPackageTransaction = async (
    props: WebhookHandlerCreateResourceParams & {
      userId: CurrentAPIUser['userId'];
      paymentId: string;
    }
  ): Promise<WebhookHandlerCreateResourceResponse> => {
    const { currentAPIUser, token, userId, paymentId } = props;
    currentAPIUser.userId = userId;
    const controllerData = this._controllerDataBuilder
      .currentAPIUser(currentAPIUser)
      .routeData({
        query: {
          token,
          paymentId,
        },
        headers: {},
        body: {},
        params: {},
        endpointPath: '',
        rawBody: {},
        cookies: {},
        req: {},
      })
      .build();
    const createPackageTransactionUsecaseRes =
      await this._createPackageTransactionUsecase.makeRequest(controllerData);
    return createPackageTransactionUsecaseRes;
  };

  public init = async (initParams: {
    makeCreatePackageTransactionUsecase: Promise<CreatePackageTransactionUsecase>;
    makeControllerDataBuilder: ControllerDataBuilder;
    convertStringToObjectId: ConvertStringToObjectId;
  }): Promise<this> => {
    const {
      makeCreatePackageTransactionUsecase,
      makeControllerDataBuilder,
      convertStringToObjectId,
    } = initParams;
    this._createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
    this._controllerDataBuilder = makeControllerDataBuilder;
    this._convertStringToObjectId = convertStringToObjectId;
    return this;
  };
}

export { WebhookHandler, WebhookHandlerCreateResourceParams, WebhookHandlerCreateResourceResponse };
