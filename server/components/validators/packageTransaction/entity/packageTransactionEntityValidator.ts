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
      remainingAppointments: this._joi.number().min(0).max(30),
      remainingReschedules: this._joi.number().min(0).max(5),
      lessonLanguage: this._joi.string().max(5),
      isSubscription: this._joi.boolean(),
      paymentData: this._joi.object({
        gatewayName: this._joi.string().max(256),
        gatewayTransactionId: this._joi.string().alphanum().max(256),
      }),
      createdDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
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
      lessonDuration: this._joi.number().forbidden(),
      priceData: this._joi.object().forbidden(),
      remainingAppointments: this._joi.number().forbidden(),
      remainingReschedules: this._joi.number().forbidden(),
      lessonLanguage: this._joi.string().forbidden(),
      isSubscription: this._joi.boolean().forbidden(),
      paymentData: this._joi.object().forbidden(),
      isTerminated: this._joi.boolean().forbidden(),
      terminationDate: this._joi.date().forbidden(),
      transactionDate: this._joi.date().forbidden(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled'),
      createdDate: this._joi.date().forbidden(),
      lastModifiedDate: this._joi.date().forbidden(),
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
