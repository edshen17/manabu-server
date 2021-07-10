import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class PackageTransactionEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._createValidationSchema = this._joi.object().keys({
      hostedById: this._joi.string().alphanum().min(24).max(24),
      reservedById: this._joi.string().alphanum().min(24).max(24),
      packageId: this._joi.string().alphanum().min(24).max(24),
      lessonDuration: this._joi.number().min(30).max(120),
      priceData: this._joi.object({
        currency: this._joi.string().max(5),
        subTotal: this._joi.number().min(0),
        total: this._joi.number().min(0),
      }),
      remainingAppointments: this._joi.number().min(0).max(30),
      remainingReschedules: this._joi.number().min(0).max(5),
      lessonLanguage: this._joi.string().max(5),
      isSubscription: this._joi.boolean(),
      paymentData: this._joi.object({
        gatewayName: this._joi.string().max(256),
        gatewayTransactionId: this._joi.string().alphanum().max(256),
      }),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedById: this._joi.string().forbidden(),
      reservedById: this._joi.string().forbidden(),
      packageId: this._joi.string().forbidden(),
      lessonDuration: this._joi.number().forbidden(),
      priceData: this._joi.object().forbidden(),
      remainingAppointments: this._joi.number().forbidden(),
      remainingReschedules: this._joi.number().forbidden(),
      lessonLanguage: this._joi.string().forbidden(),
      isSubscription: this._joi.boolean().forbidden(),
      methodData: this._joi.object().forbidden(),
      isTerminated: this._joi.boolean().forbidden(),
      terminationDate: this._joi.date().forbidden(),
      transactionDate: this._joi.date().forbidden(),
      packageData: this._joi.object().forbidden(),
      hostedByData: this._joi.object().forbidden(),
      reservedByData: this._joi.object().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { PackageTransactionEntityValidator };
