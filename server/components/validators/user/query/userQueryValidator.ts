import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class UserQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = () => {
    this._queryValidationSchema = this._joi.object().keys({
      state: this._joi.object({
        redirectUserId: this._joi.string().alphanum().min(24).max(24),
        isTeacherApp: this._joi.boolean(),
      }),
    });
  };
}

export { UserQueryValidator };
