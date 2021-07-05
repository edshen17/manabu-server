import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class UserEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._entityValidationSchema = this._joi.object().keys({
      name: this._joi.string().pattern(new RegExp(/^([a-zA-Z ]){2,30}$/)),
      email: this._joi.string().email(),
      password: this._joi
        .string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)),
      profileImage: this._joi.string().dataUri().allow(''),
      commMethods: this._joi.object({
        method: this._joi.string(),
        id: this._joi.string(),
      }),
      profileBio: this._joi.string().htmlStrip(),
      dateRegistered: this._joi.date().forbidden(),
      lastUpdated: this._joi.date(),
      languages: this._joi.array().items({
        level: this._joi.string(),
        language: this._joi.string(),
      }),
      region: this._joi.string(),
      timezone: this._joi.string(),
      lastOnline: this._joi.date(),
      role: this._joi.string().forbidden(),
      settings: this._joi.object({
        currency: this._joi.string(),
        locale: this._joi.string(),
      }),
      membership: this._joi.array(),
      isEmailVerified: this._joi.boolean(),
      verificationToken: this._joi.string().forbidden(),
    });
  };
}

export { UserEntityValidator };
