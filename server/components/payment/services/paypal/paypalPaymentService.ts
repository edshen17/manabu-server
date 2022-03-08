import paypal, { Item, Payment, SDKError } from 'paypal-rest-sdk';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractPaymentService } from '../../abstractions/AbstractPaymentService';
import {
  PaymentServiceExecutePaymentParams,
  PaymentServiceExecutePaymentResponse,
  PaymentServiceExecutePayoutParams,
  PaymentServiceExecutePayoutResponse,
  PAYMENT_GATEWAY_NAME,
} from '../../abstractions/IPaymentService';

type Paypal = typeof paypal;
type OptionalPaypalPaymentServiceInitParams = {};

class PaypalPaymentService extends AbstractPaymentService<
  Paypal,
  OptionalPaypalPaymentServiceInitParams
> {
  protected _createPaymentJson = (props: PaymentServiceExecutePaymentParams): Payment => {
    const { successRedirectUrl, cancelRedirectUrl, items, currency, description, total, token } =
      props as PaymentServiceExecutePaymentParams & { items: Item[] };
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
  ): Promise<PaymentServiceExecutePaymentResponse> => {
    return new Promise((resolve, reject) => {
      this._paymentLib.payment.create(
        createPaymentJson,
        (err: SDKError, payment: StringKeyObject) => {
          if (err || !payment) {
            reject(err || payment);
          }
          if (payment && payment.links) {
            const redirectUrl = payment.links.filter((link: StringKeyObject) => {
              return link.rel == 'approval_url';
            })[0].href;
            const executePaymentRes = { redirectUrl };
            resolve(executePaymentRes);
          } else {
            const paypalErr = new Error();
            reject(paypalErr);
          }
        }
      );
    });
  };

  protected _createPayoutJson = (props: PaymentServiceExecutePayoutParams) => {
    const { type, emailData, id, recipients } = props;
    const { subject, message } = emailData;
    const createPayoutJson = {
      sender_batch_header: {
        recipient_type: type.toUpperCase(),
        email_message: message,
        note: message,
        sender_batch_id: id,
        email_subject: subject,
      },
      items: recipients,
    };
    return createPayoutJson;
  };

  protected _executePayoutTemplate = (
    createPayoutJson: ReturnType<PaypalPaymentService['_createPayoutJson']>
  ): Promise<PaymentServiceExecutePayoutResponse> => {
    return new Promise((resolve, reject) => {
      this._paymentLib.payout.create(createPayoutJson, (err: SDKError, payout: StringKeyObject) => {
        if (err) {
          reject(err);
        }
        const { batch_header } = payout;
        const { payout_batch_id } = batch_header;
        const executePayoutRes = { id: payout_batch_id };
        resolve(executePayoutRes);
      });
    });
  };
}

export { PaypalPaymentService, Paypal };
