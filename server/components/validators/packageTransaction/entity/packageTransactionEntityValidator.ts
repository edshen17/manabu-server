import { PAYMENT_GATEWAY_NAME } from '../../../paymentHandlers/abstractions/IPaymentHandler';
import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class PackageTransactionEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      hostedById: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      reservedById: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      packageId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      lessonDuration: this._joi.number().min(30).max(120).valid(30, 60, 90, 120),
      priceData: this._joi.object({
        currency: this._joi.string().max(5),
        subTotal: this._joi.number().min(0),
        total: this._joi.number().min(0),
      }),
      terminationDate: this._joi.date(),
      isTerminated: this._joi.boolean(),
      remainingAppointments: this._joi.number().min(0).max(30),
      remainingReschedules: this._joi.number().min(0).max(5),
      lessonLanguage: this._joi.string().max(5),
      isSubscription: this._joi.boolean(),
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
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled'),
      lastModifiedDate: this._joi.date(),
      creationDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedById: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      reservedById: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      packageId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      priceData: this._joi
        .object({
          currency: this._joi.string().max(5),
          subTotal: this._joi.number().min(0),
          total: this._joi.number().min(0),
        })
        .forbidden(),
      terminationDate: this._joi.date().forbidden(),
      isTerminated: this._joi.boolean().forbidden(),
      remainingAppointments: this._joi.number().min(0).max(30).forbidden(),
      remainingReschedules: this._joi.number().min(0).max(5).forbidden(),
      lessonLanguage: this._joi.string().max(5).forbidden(),
      isSubscription: this._joi.boolean().forbidden(),
      paymentData: this._joi
        .object({
          gateway: this._joi.string().max(256),
          id: this._joi.string().alphanum().max(256),
        })
        .forbidden(),
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

export { PackageTransactionEntityValidator };
