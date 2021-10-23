import paypal, { Payment, SDKError } from 'paypal-rest-sdk';
import { StringKeyObject } from '../../../types/custom';
import { AbstractPaymentHandler } from '../abstractions/AbstractPaymentHandler';
import {
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
} from '../abstractions/IPaymentHandler';

type OptionalPaypalHandlerInitParams = {};

class PaypalHandler extends AbstractPaymentHandler<typeof paypal, OptionalPaypalHandlerInitParams> {
  protected _createPaymentJson = (props: PaymentHandlerExecuteParams) => {
    const { successRedirectUrl, cancelRedirectUrl, items, currency, description, total } = props;
    const createPaymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
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
            currency,
            total,
          },
          description,
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

export { PaypalHandler };
