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
      terminationDate: this._joi.date(),
      isTerminated: this._joi.boolean(),
      remainingAppointments: this._joi.number().min(0).max(30).integer(),
      remainingReschedules: this._joi.number().min(0).max(5).integer(),
      lessonLanguage: this._joi.string().max(5),
      isSubscription: this._joi.boolean(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled', 'completed'),
      lastModifiedDate: this._joi.date(),
      createdDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedById: this._joi.forbidden(),
      reservedById: this._joi.forbidden(),
      packageId: this._joi.forbidden(),
      terminationDate: this._joi.forbidden(),
      isTerminated: this._joi.forbidden(),
      remainingAppointments: this._joi.forbidden(),
      remainingReschedules: this._joi.forbidden(),
      lessonLanguage: this._joi.forbidden(),
      isSubscription: this._joi.forbidden(),
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

export { PackageTransactionEntityValidator };
