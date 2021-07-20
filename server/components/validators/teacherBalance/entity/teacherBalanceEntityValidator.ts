import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class TeacherBalanceEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      userId: this._joi.objectId(),
      balance: this._joi.number().min(0),
      currency: this._joi.string().max(5),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      userId: this._joi.objectId().forbidden(),
      balance: this._joi.object().forbidden(),
      currency: this._joi.object().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { TeacherBalanceEntityValidator };
