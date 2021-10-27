import { Stripe } from 'stripe';
import { AbstractPaymentHandler } from '../abstractions/AbstractPaymentHandler';
import {
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
} from '../abstractions/IPaymentHandler';

type OptionalStripePaymentHandlerInitParams = {};

class StripePaymentHandler extends AbstractPaymentHandler<
  Stripe,
  OptionalStripePaymentHandlerInitParams
> {
  protected _createPaymentJson = (
    props: PaymentHandlerExecuteParams
  ): Stripe.Checkout.SessionCreateParams => {
    const { successRedirectUrl, cancelRedirectUrl, items } = props;
    const createPaymentJson = {
      line_items: items,
      payment_method_types: ['card', 'wechat_pay', 'grabpay', 'alipay'],
      mode: 'payment',
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl,
      payment_method_options: {
        wechat_pay: {
          client: 'web',
        },
      },
    } as Stripe.Checkout.SessionCreateParams;
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: Stripe.Checkout.SessionCreateParams
  ): Promise<PaymentHandlerExecutePaymentRes> => {
    const session = await this._paymentLib.checkout.sessions.create(createPaymentJson);
    const executePaymentRes = { redirectUrl: <string>session.url };
    return executePaymentRes;
  };
}

export { StripePaymentHandler };
