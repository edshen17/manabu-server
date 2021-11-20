import { PAYMENT_GATEWAY_NAME } from '../../../payment/abstractions/IPaymentService';
import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class BalanceTransactionEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      userId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      status: this._joi.string().valid('pending', 'completed', 'cancelled'),
      currency: this._joi.string().max(5),
      type: this._joi.string().valid('packageTransaction'),
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
          .valid(
            PAYMENT_GATEWAY_NAME.PAYNOW,
            PAYMENT_GATEWAY_NAME.PAYPAL,
            PAYMENT_GATEWAY_NAME.STRIPE
          ),
        id: this._joi.string().max(256).allow(''),
      }),
      lastModifiedDate: this._joi.date(),
      creationDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      userId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled').forbidden(),
      currency: this._joi.string().max(5).forbidden(),
      type: this._joi.string().valid('packageTransaction').forbidden(),
      packageTransactionId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      balanceChange: this._joi.number().forbidden(),
      processingFee: this._joi.number().forbidden(),
      tax: this._joi.number().forbidden(),
      totalPayment: this._joi.number().forbidden(),
      runningBalance: this._joi
        .object({
          totalAvailable: this._joi.number().min(0),
          currency: this._joi.string().max(5),
        })
        .forbidden(),
      paymentData: this._joi.object({
        gateway: this._joi
          .string()
          .max(256)
          .valid(
            PAYMENT_GATEWAY_NAME.PAYNOW,
            PAYMENT_GATEWAY_NAME.PAYPAL,
            PAYMENT_GATEWAY_NAME.STRIPE
          )
          .forbidden(),
        id: this._joi.string().max(256).allow('').forbidden(),
      }),
      lastModifiedDate: this._joi.date().forbidden(),
      creationDate: this._joi.date().forbidden(),
    });
    this._deleteValidationSchema = this._createValidationSchema.keys({
      _id: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { BalanceTransactionEntityValidator };
