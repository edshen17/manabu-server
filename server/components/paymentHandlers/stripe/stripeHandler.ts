import { Stripe } from 'stripe';
import { AbstractPaymentHandler } from '../abstractions/AbstractPaymentHandler';
import {
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
} from '../abstractions/IPaymentHandler';

type OptionalStripeHandlerInitParams = {};

class StripeHandler extends AbstractPaymentHandler<Stripe | null, OptionalStripeHandlerInitParams> {
  protected _createPaymentJson = (props: PaymentHandlerExecuteParams) => {
    const { successRedirectUrl, cancelRedirectUrl, items } = props;
    const createPaymentJson = {
      line_items: items,
      payment_method_types: ['card', 'grabpay'],
      mode: 'payment',
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl,
    };
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: Stripe.Checkout.SessionCreateParams
  ): Promise<PaymentHandlerExecutePaymentRes> => {
    const session = await this._paymentLib!.checkout.sessions.create(createPaymentJson);
    const executePaymentRes = { redirectUrl: session.url! };
    return executePaymentRes;
  };
}

export { StripeHandler };
