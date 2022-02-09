"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionCheckoutQueryValidator = void 0;
const IPaymentService_1 = require("../../../../payment/abstractions/IPaymentService");
const AbstractQueryValidator_1 = require("../../../abstractions/AbstractQueryValidator");
class PackageTransactionCheckoutQueryValidator extends AbstractQueryValidator_1.AbstractQueryValidator {
    _initValidationSchemas = () => {
        this._queryValidationSchema = this._joi.object().keys({
            paymentGateway: this._joi
                .string()
                .valid(IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYPAL, IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYNOW, IPaymentService_1.PAYMENT_GATEWAY_NAME.STRIPE),
        });
    };
}
exports.PackageTransactionCheckoutQueryValidator = PackageTransactionCheckoutQueryValidator;
