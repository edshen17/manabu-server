import Omise from 'omise';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractPaymentService } from '../../abstractions/AbstractPaymentService';
import { PaymentServiceExecutePaymentParams, PaymentServiceExecutePaymentResponse, PaymentServiceExecutePayoutParams, PaymentServiceExecutePayoutResponse } from '../../abstractions/IPaymentService';
declare type OptionalPaynowPaymentServiceInitParams = {};
declare class PaynowPaymentService extends AbstractPaymentService<Omise.IOmise, OptionalPaynowPaymentServiceInitParams> {
    protected _createPaymentJson: (props: PaymentServiceExecutePaymentParams) => PaymentServiceExecutePaymentParams;
    protected _executePaymentTemplate: (createPaymentJson: PaymentServiceExecutePaymentParams) => Promise<PaymentServiceExecutePaymentResponse>;
    protected _createPayoutJson: (props: PaymentServiceExecutePayoutParams) => StringKeyObject;
    protected _executePayoutTemplate: (createPayoutJson: StringKeyObject) => Promise<PaymentServiceExecutePayoutResponse>;
}
export { PaynowPaymentService };
