import { SDKError } from 'paypal-rest-sdk';
import { StringKeyObject } from '../../../../types/custom';
import { Paypal } from '../../../payment/services/paypal/paypalPaymentService';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import {
  WebhookHandler,
  WebhookHandlerCreateResourceResponse,
} from '../../utils/webhookHandler/webhookHandler';

type OptionalCreatePaypalWebhookUsecaseInitParams = {
  makeWebhookHandler: Promise<WebhookHandler>;
  paypal: Paypal;
};

type CreatePaypalWebhookUsecaseResponse = WebhookHandlerCreateResourceResponse;

class CreatePaypalWebhookUsecase extends AbstractCreateUsecase<
  OptionalCreatePaypalWebhookUsecaseInitParams,
  CreatePaypalWebhookUsecaseResponse,
  unknown
> {
  private _webhookHandler!: WebhookHandler;
  private _paypal!: Paypal;

  protected _isProtectedResource = (): boolean => {
    return false;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePaypalWebhookUsecaseResponse> => {
    const { body, currentAPIUser } = props;
    const { event_type, resource } = body;
    const { transactions, id, payer } = resource;
    const token = transactions[0].custom;
    const paymentId = id;
    let usecaseRes: CreatePaypalWebhookUsecaseResponse = {};
    switch (event_type) {
      case 'PAYMENTS.PAYMENT.CREATED':
        this._executePayment({ paymentId, payer, transactions });
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

  private _executePayment = (props: {
    paymentId: string;
    payer: StringKeyObject;
    transactions: StringKeyObject[];
  }): void => {
    const { paymentId, payer, transactions } = props;
    const { payer_info } = payer;
    const { payer_id } = payer_info;
    const paymentJson = {
      payer_id,
      transactions,
    };
    this._paypal.payment.execute(
      paymentId,
      paymentJson,
      (err: SDKError, payment: StringKeyObject) => {
        console.log(err, payment);
      }
    );
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePaypalWebhookUsecaseInitParams
  ): Promise<void> => {
    const { makeWebhookHandler, paypal } = optionalInitParams;
    this._webhookHandler = await makeWebhookHandler;
    this._paypal = paypal;
  };
}

export { CreatePaypalWebhookUsecase, CreatePaypalWebhookUsecaseResponse };
