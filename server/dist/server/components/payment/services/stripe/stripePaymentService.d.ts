import { Stripe } from 'stripe';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractPaymentService } from '../../abstractions/AbstractPaymentService';
import { PaymentServiceExecutePaymentParams, PaymentServiceExecutePaymentResponse, PaymentServiceExecutePayoutParams, PaymentServiceExecutePayoutResponse } from '../../abstractions/IPaymentService';
declare type OptionalStripePaymentServiceInitParams = {};
declare class StripePaymentService extends AbstractPaymentService<Stripe, OptionalStripePaymentServiceInitParams> {
    protected _createPaymentJson: (props: PaymentServiceExecutePaymentParams) => Stripe.Checkout.SessionCreateParams;
    protected _executePaymentTemplate: (createPaymentJson: Stripe.Checkout.SessionCreateParams) => Promise<PaymentServiceExecutePaymentResponse>;
    protected _createPayoutJson: (props: PaymentServiceExecutePayoutParams) => StringKeyObject;
    protected _executePayoutTemplate: (createPayoutJson: StringKeyObject) => Promise<PaymentServiceExecutePayoutResponse>;
}
export { StripePaymentService };
