import { Stripe } from 'stripe';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractPaymentService } from '../../abstractions/AbstractPaymentService';
import {
  PAYMENT_TYPE,
  PaymentServiceExecutePaymentParams,
  PaymentServiceExecutePaymentResponse,
  PaymentServiceExecutePayoutParams,
  PaymentServiceExecutePayoutResponse,
  StripeItems,
} from '../../abstractions/IPaymentService';

type OptionalStripePaymentServiceInitParams = {};

class StripePaymentService extends AbstractPaymentService<
  Stripe,
  OptionalStripePaymentServiceInitParams
> {
  protected _createPaymentJson = ({
    successRedirectUrl,
    cancelRedirectUrl,
    items,
    token,
    type,
  }: PaymentServiceExecutePaymentParams): Stripe.Checkout.SessionCreateParams => {
    const isSubscription = type === PAYMENT_TYPE.SUBSCRIPTION;
    const metadata = { token };
    const createPaymentJson: Stripe.Checkout.SessionCreateParams = {
      line_items: items as StripeItems,
      payment_method_types: isSubscription ? ['card'] : ['card', 'wechat_pay', 'grabpay', 'alipay'],
      mode: type,
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl,
      payment_method_options: {
        wechat_pay: {
          client: 'web',
        },
      },
      ...(isSubscription
        ? {
            subscription_data: {
              metadata,
            },
          }
        : {
            payment_intent_data: {
              metadata,
            },
          }),
    };
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
