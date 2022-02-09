/// <reference types="custom" />
import { StringKeyObject } from '../../../types/custom';
import { IPaymentService, PaymentServiceExecutePaymentParams, PaymentServiceExecutePaymentResponse, PaymentServiceExecutePayoutParams, PaymentServiceExecutePayoutResponse, PaymentServiceInitParams } from './IPaymentService';
declare abstract class AbstractPaymentService<PaymentLibType, OptionalPaymentServiceInitParams> implements IPaymentService<PaymentLibType, OptionalPaymentServiceInitParams> {
    protected _paymentLib: PaymentLibType;
    executePayment: (props: PaymentServiceExecutePaymentParams) => Promise<PaymentServiceExecutePaymentResponse>;
    protected abstract _createPaymentJson(props: PaymentServiceExecutePaymentParams): StringKeyObject;
    protected abstract _executePaymentTemplate(createPaymentJson: StringKeyObject): Promise<PaymentServiceExecutePaymentResponse>;
    executeSubscription: () => Promise<PaymentServiceExecutePaymentResponse>;
    executePayout: (props: PaymentServiceExecutePayoutParams) => Promise<PaymentServiceExecutePayoutResponse>;
    protected abstract _createPayoutJson(props: PaymentServiceExecutePayoutParams): StringKeyObject;
    protected abstract _executePayoutTemplate(createPayoutJson: StringKeyObject): Promise<PaymentServiceExecutePayoutResponse>;
    init: (initParams: PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>) => Promise<this>;
    protected _initTemplate: (optionalInitParams: Omit<PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>, 'paymentLib'>) => Promise<void> | void;
}
export { AbstractPaymentService, PaymentServiceExecutePaymentResponse };
