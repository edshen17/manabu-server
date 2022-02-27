import { AbstractParamsValidator } from '../../abstractions/AbstractParamsValidator';

class WordParamsValidator extends AbstractParamsValidator {
  protected _initValidationSchemas = (): void => {
    this._paramsValidationSchema = this._joi.object().keys({
      word: this._joi.string().min(1).max(10000),
    });
  };
}

export { WordParamsValidator };
