/// <reference types="custom" />
import paypal, { Payment } from 'paypal-rest-sdk';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractPaymentService } from '../../abstractions/AbstractPaymentService';
import { PaymentServiceExecutePaymentParams, PaymentServiceExecutePaymentResponse, PaymentServiceExecutePayoutParams, PaymentServiceExecutePayoutResponse } from '../../abstractions/IPaymentService';
declare type Paypal = typeof paypal;
declare type OptionalPaypalPaymentServiceInitParams = {};
declare class PaypalPaymentService extends AbstractPaymentService<Paypal, OptionalPaypalPaymentServiceInitParams> {
    protected _createPaymentJson: (props: PaymentServiceExecutePaymentParams) => Payment;
    protected _executePaymentTemplate: (createPaymentJson: Payment) => Promise<PaymentServiceExecutePaymentResponse>;
    protected _createPayoutJson: (props: PaymentServiceExecutePayoutParams) => {
        sender_batch_header: {
            recipient_type: string;
            email_message: string;
            note: string;
            sender_batch_id: string;
            email_subject: string;
        };
        items: StringKeyObject[];
    };
    protected _executePayoutTemplate: (createPayoutJson: ReturnType<PaypalPaymentService['_createPayoutJson']>) => Promise<PaymentServiceExecutePayoutResponse>;
}
export { PaypalPaymentService };
