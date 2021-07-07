import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class TeacherEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._entityValidationSchema = this._joi.object().keys({
      userId: this._joi.string().alphanum().min(24).max(24),
      teachingLanguages: this._joi.array().items({
        language: this._joi.string().max(5),
        level: this._joi.string().max(5),
      }),
      alsoSpeaks: this._joi.array().items({
        language: this._joi.string().max(5),
        level: this._joi.string().max(5),
      }),
      introductionVideo: this._joi.string().dataUri().allow('').max(2048),
      isApproved: this._joi.boolean(),
      isHidden: this._joi.boolean(),
      teacherType: this._joi.string().valid('professional', 'community'),
      licensePath: this._joi.string().dataUri().allow('').max(2048),
      hourlyRate: this._joi.object({
        amount: this._joi.number(),
        currency: this._joi.string().max(5),
      }),
      lessonCount: this._joi.number(),
      studentCount: this._joi.number(),
    });
  };
}

export { TeacherEntityValidator };
