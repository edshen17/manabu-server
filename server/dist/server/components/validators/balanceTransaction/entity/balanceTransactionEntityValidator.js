"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceTransactionEntityValidator = void 0;
const IPaymentService_1 = require("../../../payment/abstractions/IPaymentService");
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
class BalanceTransactionEntityValidator extends AbstractEntityValidator_1.AbstractEntityValidator {
    _initValidationSchemas = () => {
        this._createValidationSchema = this._joi.object().keys({
            userId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
            status: this._joi.string().valid('pending', 'completed', 'cancelled'),
            currency: this._joi.string().max(5),
            type: this._joi
                .string()
                .valid('packageTransaction', 'creditTransaction', 'payout', 'expired'),
            packageTransactionId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
            balanceChange: this._joi.number(),
            processingFee: this._joi.number(),
            tax: this._joi.number(),
            totalPayment: this._joi.number(),
            runningBalance: this._joi.object({
                totalAvailable: this._joi.number().min(0),
                currency: this._joi.string().max(5),
            }),
            paymentData: this._joi.object({
                gateway: this._joi
                    .string()
                    .max(256)
                    .valid(IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYNOW, IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYPAL, IPaymentService_1.PAYMENT_GATEWAY_NAME.STRIPE),
                id: this._joi.string().max(256).allow(''),
            }),
            lastModifiedDate: this._joi.date(),
            createdDate: this._joi.date(),
        });
        this._editValidationSchema = this._createValidationSchema.keys({
            userId: this._joi.forbidden(),
            status: this._joi.forbidden(),
            currency: this._joi.forbidden(),
            type: this._joi.forbidden(),
            packageTransactionId: this._joi.forbidden(),
            balanceChange: this._joi.forbidden(),
            processingFee: this._joi.forbidden(),
            tax: this._joi.forbidden(),
            totalPayment: this._joi.forbidden(),
            runningBalance: this._joi.forbidden(),
            paymentData: this._joi.forbidden(),
            lastModifiedDate: this._joi.forbidden(),
            createdDate: this._joi.forbidden(),
        });
        this._deleteValidationSchema = this._createValidationSchema.keys({
            _id: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        });
        this._adminValidationSchema = this._editValidationSchema;
    };
}
exports.BalanceTransactionEntityValidator = BalanceTransactionEntityValidator;
