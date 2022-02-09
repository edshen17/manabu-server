"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherEntityValidator = void 0;
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
class TeacherEntityValidator extends AbstractEntityValidator_1.AbstractEntityValidator {
    _initValidationSchemas = () => {
        this._createValidationSchema = this._joi.object().keys({
            approvalDate: this._joi.date(),
            teachingLanguages: this._joi
                .array()
                .items({
                code: this._joi.string().max(5),
                level: this._joi.string().max(5),
            })
                .max(5),
            alsoSpeaks: this._joi
                .array()
                .items({
                code: this._joi.string().max(5),
                level: this._joi.string().max(5),
            })
                .max(5),
            introductionVideoUrl: this._joi.string().uri().allow('').max(2048),
            applicationStatus: this._joi.string().valid('pending', 'approved', 'rejected'),
            settings: this._joi.object({
                isHidden: this._joi.boolean(),
                emailAlerts: {},
                payoutData: this._joi.object({
                    email: this._joi.string().email().max(256).allow(''),
                }),
            }),
            type: this._joi.string().valid('unlicensed', 'licensed').allow(''),
            licenseUrl: this._joi.string().uri().allow('').max(2048),
            priceData: this._joi.object({
                hourlyRate: this._joi.number().integer().min(0),
                currency: this._joi.string().max(5),
            }),
            tags: this._joi.array().items(this._joi.string().max(100)).unique(),
            lessonCount: this._joi.number().integer().min(0),
            studentCount: this._joi.number().integer().min(0),
            createdDate: this._joi.date(),
            lastModifiedDate: this._joi.date(),
        });
        this._editValidationSchema = this._createValidationSchema.keys({
            approvalDate: this._joi.forbidden(),
            lessonCount: this._joi.forbidden(),
            applicationStatus: this._joi.forbidden(),
            studentCount: this._joi.forbidden(),
            createdDate: this._joi.forbidden(),
            lastModifiedDate: this._joi.forbidden(),
        });
        this._deleteValidationSchema = this._createValidationSchema.keys({
            _id: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        });
        this._adminValidationSchema = this._editValidationSchema.keys({
            applicationStatus: this._joi.string().valid('pending', 'approved', 'rejected'),
            approvalDate: this._joi.date(),
        });
    };
}
exports.TeacherEntityValidator = TeacherEntityValidator;
