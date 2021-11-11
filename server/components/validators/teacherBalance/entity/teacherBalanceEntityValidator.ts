import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class TeacherBalanceEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      userId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      balance: this._joi.number().min(0),
      currency: this._joi.string().max(5),
      creationDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      userId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      creationDate: this._joi.date().forbidden(),
      lastModifiedDate: this._joi.date().forbidden(),
      balance: this._joi.object().forbidden(),
      currency: this._joi.object().forbidden(),
    });
    this._deleteValidationSchema = this._createValidationSchema.keys({
      _id: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { TeacherBalanceEntityValidator };
