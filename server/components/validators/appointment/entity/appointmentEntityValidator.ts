import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class AppointmentEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      hostedById: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      reservedById: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      packageTransactionId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      startDate: this._joi.date(),
      endDate: this._joi.date().greater(this._joi.ref('startDate')),
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
      packageTransactionId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      isPast: this._joi.boolean().forbidden(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled'),
      cancellationReason: this._joi.string().max(256),
      packageTransactionData: this._joi.object().forbidden(),
      createdDate: this._joi.date().forbidden(),
      lastModifiedDate: this._joi.date().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { AppointmentEntityValidator };
