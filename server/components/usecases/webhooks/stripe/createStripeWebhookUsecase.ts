import Stripe from 'stripe';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { DB_SERVICE_COLLECTIONS } from '../../../dataAccess/abstractions/IDbService';
import { ConvertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CreatePackageTransactionUsecase } from '../../packageTransaction/createPackageTransactionUsecase/createPackageTransactionUsecase';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';

type OptionalCreateStripeWebhookUsecaseInitParams = {
  makeCreatePackageTransactionUsecase: Promise<CreatePackageTransactionUsecase>;
  makeControllerDataBuilder: ControllerDataBuilder;
  convertStringToObjectId: ConvertStringToObjectId;
  stripe: Stripe;
};

type CreateStripeWebhookUsecaseResponse = {
  packageTransaction?: PackageTransactionDoc;
};

type CreateResourceBrancherParams = {
  userToken: string;
  currentAPIUser: CurrentAPIUser;
  paymentId: string;
};

class CreateStripeWebhookUsecase extends AbstractCreateUsecase<
  OptionalCreateStripeWebhookUsecaseInitParams,
  CreateStripeWebhookUsecaseResponse,
  unknown
> {
  private _createPackageTransactionUsecase!: CreatePackageTransactionUsecase;
  private _controllerDataBuilder!: ControllerDataBuilder;
  private _stripe!: Stripe;
  private _convertStringToObjectId!: ConvertStringToObjectId;

  protected _isProtectedResource = (): boolean => {
    return false;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateStripeWebhookUsecaseResponse> => {
    const { body, headers, currentAPIUser } = props;
    const stripeEvent = this._getStripeEvent({ body, headers });
    const stripeEventType = stripeEvent.type;
    const stripeEventObj = (stripeEvent as StringKeyObject).data.object;
    const userToken: string = stripeEventObj.charges.data[0].metadata.token;
    const paymentId: string = stripeEventObj.id;
    let usecaseRes: CreateStripeWebhookUsecaseResponse = {};
    switch (stripeEventType) {
      case 'payment_intent.succeeded':
        usecaseRes = await this._createResourceBrancher({
          userToken,
          currentAPIUser,
          paymentId,
        });
        break;
      default:
        break;
    }
    return usecaseRes;
  };

  private _getStripeEvent = (props: { body: any; headers: StringKeyObject }): Stripe.Event => {
    const { headers, body } = props;
    const { payloadString } = body;
    const sig = headers['stripe-signature'];
    let webhookSecret = process.env.STRIPE_WEBHOOK_SECREY_KEY_DEV!;
    let constructEventBody = payloadString;
    if (process.env.NODE_ENV == 'production') {
      webhookSecret = process.env.STRIPE_WEBHOOK_SECREY_KEY!;
      constructEventBody = body;
    }
    const event = this._stripe.webhooks.constructEvent(constructEventBody, sig, webhookSecret);
    return event;
  };

  private _createResourceBrancher = async (
    props: CreateResourceBrancherParams
  ): Promise<CreateStripeWebhookUsecaseResponse> => {
    const { userToken } = props;
    const tokenArr = userToken.split('-');
    const userId = this._convertStringToObjectId(tokenArr[0]);
    const resourceName = tokenArr[1];
    let usecaseRes: CreateStripeWebhookUsecaseResponse = {};
    switch (resourceName) {
      case DB_SERVICE_COLLECTIONS.PACKAGE_TRANSACTIONS:
        usecaseRes = await this._createPackageTransaction({ ...props, userId });
        break;
      default:
        break;
    }
    return usecaseRes;
  };

  private _createPackageTransaction = async (
    props: CreateResourceBrancherParams & { userId: CurrentAPIUser['userId']; paymentId: string }
  ): Promise<CreateStripeWebhookUsecaseResponse> => {
    const { currentAPIUser, userToken, userId, paymentId } = props;
    currentAPIUser.userId = userId;
    const controllerData = this._controllerDataBuilder
      .currentAPIUser(currentAPIUser)
      .routeData({
        query: {
          token: userToken,
          paymentId,
        },
        headers: {},
        body: {},
        params: {},
        endpointPath: '',
      })
      .build();
    const packageTransactionUsecaseRes = await this._createPackageTransactionUsecase.makeRequest(
      controllerData
    );
    return packageTransactionUsecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateStripeWebhookUsecaseInitParams
  ): Promise<void> => {
    const {
      makeCreatePackageTransactionUsecase,
      makeControllerDataBuilder,
      stripe,
      convertStringToObjectId,
    } = optionalInitParams;
    this._createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
    this._controllerDataBuilder = makeControllerDataBuilder;
    this._stripe = stripe;
    this._convertStringToObjectId = convertStringToObjectId;
  };
}

export { CreateStripeWebhookUsecase, CreateStripeWebhookUsecaseResponse };
