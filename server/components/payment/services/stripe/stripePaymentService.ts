import { Stripe } from 'stripe';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractPaymentService } from '../../abstractions/AbstractPaymentService';
import {
  PaymentServiceExecutePaymentParams,
  PaymentServiceExecutePaymentResponse,
  PaymentServiceExecutePayoutParams,
  PaymentServiceExecutePayoutResponse,
} from '../../abstractions/IPaymentService';

type OptionalStripePaymentServiceInitParams = {};

class StripePaymentService extends AbstractPaymentService<
  Stripe,
  OptionalStripePaymentServiceInitParams
> {
  protected _createPaymentJson = (
    props: PaymentServiceExecutePaymentParams
  ): Stripe.Checkout.SessionCreateParams => {
    const { successRedirectUrl, cancelRedirectUrl, items, token } = props;
    const createPaymentJson = {
      line_items: items,
      // payment_method_types: ['card', 'wechat_pay', 'grabpay', 'alipay'],
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl,
      payment_method_options: {
        // wechat_pay: {
        //   client: 'web',
        // },
      },
      payment_intent_data: {
        metadata: { token },
      },
    } as Stripe.Checkout.SessionCreateParams;
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: Stripe.Checkout.SessionCreateParams
  ): Promise<PaymentServiceExecutePaymentResponse> => {
    const session = await this._paymentLib.checkout.sessions.create(createPaymentJson);
    const executePaymentRes = { redirectUrl: <string>session.url };
    return executePaymentRes;
  };

  protected _createPayoutJson = (props: PaymentServiceExecutePayoutParams): StringKeyObject => {
    return {};
  };

  protected _executePayoutTemplate = async (
    createPayoutJson: StringKeyObject
  ): Promise<PaymentServiceExecutePayoutResponse> => {
    return {
      id: '',
    };
  };
}

export { StripePaymentService };
