import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class WordQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = (): void => {
    this._queryValidationSchema = this._joi.object().keys({
      wordLanguage: this._joi.string().max(5),
      definitionLanguage: this._joi.string().max(5),
      page: this._joi.number().min(0).max(1000),
      limit: this._joi.number().min(0).max(1000),
    });
  };
}

export { WordQueryValidator };
