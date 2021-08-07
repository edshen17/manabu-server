import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class TeacherEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      teacherType: this._joi.string().valid('unlicensed', 'licensed').allow(''),
      teachingLanguages: this._joi.array().items({
        language: this._joi.string().max(5),
        level: this._joi.string().max(5),
      }),
      alsoSpeaks: this._joi.array().items({
        language: this._joi.string().max(5),
        level: this._joi.string().max(5),
      }),
      priceData: this._joi.object({
        hourlyRate: this._joi.number().min(0),
        currency: this._joi.string().max(5),
      }),
      introductionVideoUrl: this._joi.string().uri().allow('').max(2048),
      applicationStatus: this._joi.string().valid('pending', 'approved', 'rejected'),
      licensePathUrl: this._joi.string().uri().allow('').max(2048),
      tags: this._joi.array().items(this._joi.string().max(100)).unique(),
      isHidden: this._joi.boolean(),
      lessonCount: this._joi.number(),
      studentCount: this._joi.number(),
      createdDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      approvalDate: this._joi.date().forbidden(),
      lessonCount: this._joi.number().forbidden(),
      studentCount: this._joi.number().forbidden(),
      createdDate: this._joi.date().forbidden(),
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

export { TeacherEntityValidator };
