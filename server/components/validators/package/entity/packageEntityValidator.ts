import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';
class PackageEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      priceData: this._joi.object({
        currency: this._joi.string().max(5),
        hourlyRate: this._joi.number().min(0),
      }),
      lessonAmount: this._joi.number().min(1),
      isOffering: this._joi.boolean(),
      packageName: this._joi.string(),
      packageType: this._joi.string().valid('default', 'custom'),
      lessonDurations: this._joi.array().items(this._joi.number().valid(30, 60, 90, 120)).unique(),
      tags: this._joi.array().items(this._joi.string().max(100)).unique(),
      createdDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      createdDate: this._joi.date().forbidden(),
      lastModifiedDate: this._joi.date().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { PackageEntityValidator };
