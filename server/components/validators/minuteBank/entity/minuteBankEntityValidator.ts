import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class MinuteBankEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      hostedById: this._joi.objectId(),
      reservedById: this._joi.objectId(),
      minuteBank: this._joi.number().min(0),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedById: this._joi.objectId().forbidden(),
      reservedById: this._joi.objectId().forbidden(),
      minuteBank: this._joi.number().forbidden(),
      hostedByData: this._joi.object().forbidden(),
      reservedByData: this._joi.object().forbidden(),
      lastUpdated: this._joi.date(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { MinuteBankEntityValidator };
