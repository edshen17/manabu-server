import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class TeacherQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = () => {
    this._queryValidationSchema = this._joi.object().keys({
      teachingLanguages: this._joi.array().items(this._joi.string()),
      alsoSpeaks: this._joi.array().items(this._joi.string()),
      teacherType: this._joi.array().items(this._joi.string()),
      minPrice: this._joi.number().min(0),
      maxPrice: this._joi.number().min(0),
      teacherTags: this._joi.array().items(this._joi.string()),
      packageTags: this._joi.array().items(this._joi.string()),
      lessonDurations: this._joi.array().items(this._joi.number()),
      packageName: this._joi.string(),
      contactMethodName: this._joi.array().items(this._joi.string()),
      contactMethodType: this._joi.array().items(this._joi.string()),
    });
  };
}

export { TeacherQueryValidator };
