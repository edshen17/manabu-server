import { AbstractParamsValidator } from '../../abstractions/AbstractParamsValidator';

class ContentParamsValidator extends AbstractParamsValidator {
  protected _initValidationSchemas = (): void => {
    this._paramsValidationSchema = this._joi.object().keys({
      contentId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
  };
}

export { ContentParamsValidator };
