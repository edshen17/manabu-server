import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';
class PackageEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      priceData: this._joi.object({
        currency: this._joi.string().max(5),
        hourlyRate: this._joi.number().min(0),
      }),
      lessonAmount: this._joi.number().min(1).max(60),
      isOffering: this._joi.boolean(),
      packageName: this._joi.string().max(2048),
      packageType: this._joi.string().valid('default', 'custom'),
      lessonDurations: this._joi.array().items(this._joi.number().valid(30, 60, 90, 120)).unique(),
      tags: this._joi.array().items(this._joi.string().max(100)).unique(),
      creationDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      creationDate: this._joi.date().forbidden(),
      lastModifiedDate: this._joi.date().forbidden(),
    });
    this._deleteValidationSchema = this._createValidationSchema.keys({
      _id: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { PackageEntityValidator };
