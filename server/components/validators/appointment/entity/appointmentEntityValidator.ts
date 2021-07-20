import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class AppointmentEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      hostedById: this._joi.objectId(),
      reservedById: this._joi.objectId(),
      packageTransactionId: this._joi.objectId(),
      startTime: this._joi.date(),
      endTime: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedById: this._joi.objectId().forbidden(),
      reservedById: this._joi.objectId().forbidden(),
      packageTransactionId: this._joi.objectId().forbidden(),
      isPast: this._joi.boolean().forbidden(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled'),
      cancellationReason: this._joi.string().max(256),
      packageTransactionData: this._joi.object().forbidden(),
      locationData: this._joi.object().forbidden(),
      lastUpdated: this._joi.date(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { AppointmentEntityValidator };
