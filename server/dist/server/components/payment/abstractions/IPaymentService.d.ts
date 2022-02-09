/// <reference types="custom" />
import Omise from 'omise';
import { Item } from 'paypal-rest-sdk';
import Stripe from 'stripe';
import { StringKeyObject } from '../../../types/custom';
declare type PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams> = RequiredPaymentServiceInitParams<PaymentLibType> & OptionalPaymentServiceInitParams;
declare type RequiredPaymentServiceInitParams<PaymentLibType> = {
    paymentLib: PaymentLibType;
};
declare type PaypalItems = Item[];
declare type StripeItems = Array<Stripe.Checkout.SessionCreateParams.LineItem>;
declare type OmiseItems = {
    source: Omise.Sources.IRequest;
    charge: Omise.Charges.IRequest;
};
declare enum PAYMENT_GATEWAY_NAME {
    PAYPAL = "paypal",
    STRIPE = "stripe",
    PAYNOW = "paynow"
}
declare type PaymentServiceExecutePaymentParams = {
    successRedirectUrl: string;
    cancelRedirectUrl: string;
    items: PaypalItems | StripeItems | OmiseItems;
    currency?: string;
    description?: string;
    total: string | number;
    subscription?: boolean;
    token: string;
};
declare type PaymentServiceExecutePaymentResponse = {
    redirectUrl: string;
};
declare type PaymentServiceExecutePayoutParams = {
    type: 'email';
    emailData: {
        subject: string;
        message: string;
    };
    id: string;
    recipients: StringKeyObject[];
};
declare type PaymentServiceExecutePayoutResponse = {
    id: string;
};
interface IPaymentService<PaymentLibType, OptionalPaymentServiceInitParams> {
    executePayment: (props: PaymentServiceExecutePaymentParams) => Promise<PaymentServiceExecutePaymentResponse>;
    executeSubscription: (props: PaymentServiceExecutePaymentParams) => Promise<PaymentServiceExecutePaymentResponse>;
    executePayout: (props: PaymentServiceExecutePayoutParams) => Promise<PaymentServiceExecutePayoutResponse>;
    init: (initParams: PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>) => Promise<this>;
}
export { IPaymentService, PaymentServiceInitParams, PaymentServiceExecutePaymentParams, PaymentServiceExecutePaymentResponse, PaymentServiceExecutePayoutParams, PaymentServiceExecutePayoutResponse, PaypalItems, StripeItems, OmiseItems, PAYMENT_GATEWAY_NAME, };
