import { AbstractEntityValidator } from '../../../validators/abstractions/AbstractEntityValidator';

class TeacherEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      userId: this._joi.string().alphanum().min(24).max(24),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      userId: this._joi.string().forbidden(),
      teacherType: this._joi.string().valid('professional', 'community'),
      teachingLanguages: this._joi.array().items({
        language: this._joi.string().max(5),
        level: this._joi.string().max(5),
      }),
      alsoSpeaks: this._joi.array().items({
        language: this._joi.string().max(5),
        level: this._joi.string().max(5),
      }),
      introductionVideoUrl: this._joi.string().dataUri().allow('').max(2048),
      licensePathUrl: this._joi.string().dataUri().allow('').max(2048),
      hourlyRate: this._joi.object({
        amount: this._joi.number().min(0),
        currency: this._joi.string().max(5),
      }),
      tags: this._joi.array().items(this._joi.string().max(100)).unique(),
      lessonCount: this._joi.number().forbidden(),
      studentCount: this._joi.number().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema.keys({
      isApproved: this._joi.boolean(),
      isHidden: this._joi.boolean(),
    });
  };
}

export { TeacherEntityValidator };
