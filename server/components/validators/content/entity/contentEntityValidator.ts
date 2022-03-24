import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class ContentEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      postedById: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      collectionId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      title: this._joi.string().max(2048),
      titleNGrams: this._joi.string().max(4096),
      rawContent: this._joi.string(),
      coverImageUrl: this._joi.string().uri().allow('').max(2048),
      sourceUrl: this._joi.string().uri().allow('').max(2048),
      summary: this._joi.string().max(10000),
      entities: this._joi.array().items({
        word: this._joi.string().max(500),
        salience: this._joi.number().min(0),
      }),
      language: this._joi.string().max(5),
      tokens: this._joi.array().items({
        _id: this._joi
          .alternatives()
          .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        partOfSpeech: this._joi.string().max(10),
        text: this._joi.string(),
      }),
      categories: this._joi.array().items(this._joi.string()),
      ownership: this._joi.string().valid('public', 'private'),
      author: this._joi.string().max(256),
      type: this._joi.string().valid('article', 'book', 'video', 'wikipedia'),
      createdDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      postedById: this._joi.forbidden(),
      collectionId: this._joi.forbidden(),
      createdDate: this._joi.forbidden(),
      lastModifiedDate: this._joi.forbidden(),
    });
    this._deleteValidationSchema = this._createValidationSchema.keys({
      _id: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { ContentEntityValidator };
