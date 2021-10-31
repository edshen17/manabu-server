import paypal, { Item, Payment, SDKError } from 'paypal-rest-sdk';
import { StringKeyObject } from '../../../types/custom';
import { AbstractPaymentHandler } from '../abstractions/AbstractPaymentHandler';
import {
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
  PAYMENT_GATEWAY_NAME,
} from '../abstractions/IPaymentHandler';

type Paypal = typeof paypal;
type OptionalPaypalPaymentHandlerInitParams = {};

class PaypalPaymentHandler extends AbstractPaymentHandler<
  Paypal,
  OptionalPaypalPaymentHandlerInitParams
> {
  protected _createPaymentJson = (props: PaymentHandlerExecuteParams): Payment => {
    const { successRedirectUrl, cancelRedirectUrl, items, currency, description, total, token } =
      props as PaymentHandlerExecuteParams & { items: Item[] };
    const createPaymentJson: Payment = {
      intent: 'sale',
      payer: {
        payment_method: PAYMENT_GATEWAY_NAME.PAYPAL,
      },
      redirect_urls: {
        return_url: successRedirectUrl,
        cancel_url: cancelRedirectUrl,
      },
      transactions: [
        {
          item_list: {
            items,
          },
          amount: {
            currency: currency!,
            total: <string>total!,
          },
          description,
          custom: token,
        },
      ],
    };
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: Payment
  ): Promise<PaymentHandlerExecutePaymentRes> => {
    return new Promise((resolve, reject) => {
      this._paymentLib.payment.create(
        createPaymentJson,
        (err: SDKError, payment: StringKeyObject) => {
          if (err) {
            reject(err);
          }
          const redirectUrl = payment.links.filter((link: StringKeyObject) => {
            return link.rel == 'approval_url';
          })[0].href;
          const executePaymentRes = { redirectUrl };
          resolve(executePaymentRes);
        }
      );
    });
  };
}

export { PaypalPaymentHandler };
