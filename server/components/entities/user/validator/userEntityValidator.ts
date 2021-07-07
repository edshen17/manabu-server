import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class UserEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._entityValidationSchema = this._joi.object().keys({
      name: this._joi.string().pattern(new RegExp(/^([a-zA-Z ]){2,30}$/)),
      email: this._joi.string().email().max(254),
      password: this._joi
        .string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)),
      profileImageUrl: this._joi.string().dataUri().allow('').max(2048),
      contactMethods: this._joi.array().items({
        methodName: this._joi.string().max(256),
        methodId: this._joi.string().max(256),
        isPrimaryMethod: this._joi.boolean(),
        methodType: this._joi.string().max(256),
      }),
      profileBio: this._joi.string().htmlStrip().max(3000),
      dateRegistered: this._joi.date().forbidden(),
      languages: this._joi.array().items({
        level: this._joi.string().max(5),
        language: this._joi.string().max(5),
      }),
      region: this._joi.string().max(256),
      timezone: this._joi.string().max(256),
      lastOnline: this._joi.date(),
      role: this._joi.string().forbidden(),
      settings: this._joi.object({
        currency: this._joi.string().max(5),
        locale: this._joi.string().max(5),
      }),
      memberships: this._joi.array().items({
        name: this._joi.string().max(256),
        dateJoined: this._joi.date(),
      }),
      isEmailVerified: this._joi.boolean(),
      verificationToken: this._joi.string().forbidden(),
    });
  };
}

export { UserEntityValidator };
