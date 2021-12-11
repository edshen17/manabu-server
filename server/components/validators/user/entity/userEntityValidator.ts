import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class UserEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      name: this._joi.string().max(256),
      email: this._joi.string().email().max(256),
      password: this._joi.string().min(8),
      profileImageUrl: this._joi.string().uri().allow('').max(2048),
      profileBio: this._joi.string().htmlStrip().max(3000),
      languages: this._joi.array().items({
        level: this._joi.string().max(5),
        language: this._joi.string().max(5),
      }),
      region: this._joi.string().max(256),
      timezone: this._joi.string().max(256),
      role: this._joi.string().valid('user', 'teacher'),
      settings: this._joi.object({
        currency: this._joi.string().max(5),
        locale: this._joi.string().max(5),
        emailAlerts: {
          appointmentCreation: this._joi.boolean(),
          appointmentUpdate: this._joi.boolean(),
          appointmentStartReminder: this._joi.boolean(),
          packageTransactionCreation: this._joi.boolean(),
        },
      }),
      memberships: this._joi.array().items({
        name: this._joi.string().max(256),
        dateJoined: this._joi.date(),
      }),
      contactMethods: this._joi.array().items({
        methodName: this._joi.string().max(256),
        methodAddress: this._joi.string().max(256),
        isPrimaryMethod: this._joi.boolean(),
        methodType: this._joi.string().max(256),
      }),
      isEmailVerified: this._joi.boolean(),
      verificationToken: this._joi.string().forbidden(),
      nameNGrams: this._joi.string().max(256),
      namePrefixNGrams: this._joi.string().max(256),
      createdDate: this._joi.date(),
      lastOnlineDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
      balance: this._joi.object({
        currency: this._joi.string().max(5),
        totalCurrent: this._joi.number().min(0),
        totalPending: this._joi.number().min(0),
        totalAvailable: this._joi.number().min(0),
      }),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      role: this._joi.string().valid('user', 'teacher').forbidden(),
      memberships: this._joi
        .array()
        .items({
          name: this._joi.string().max(256),
          dateJoined: this._joi.date(),
        })
        .forbidden(),
      isEmailVerified: this._joi.boolean().forbidden(),
      verificationToken: this._joi.string().forbidden(),
      nameNGrams: this._joi.string().forbidden(),
      namePrefixNGrams: this._joi.string().forbidden(),
      createdDate: this._joi.date().forbidden(),
      lastOnlineDate: this._joi.date().forbidden(),
      lastModifiedDate: this._joi.date().forbidden(),
      balance: this._joi
        .object({
          currency: this._joi.string().max(5),
          totalCurrent: this._joi.number().min(0),
          totalPending: this._joi.number().min(0),
          totalAvailable: this._joi.number().min(0),
        })
        .forbidden(),
    });
    this._deleteValidationSchema = this._createValidationSchema.keys({
      _id: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
    this._adminValidationSchema = this._editValidationSchema.keys({
      memberships: this._joi.array().items({
        name: this._joi.string().max(256),
        dateJoined: this._joi.date(),
      }),
      role: this._joi.string().valid('user', 'teacher'),
    });
  };
}

export { UserEntityValidator };
