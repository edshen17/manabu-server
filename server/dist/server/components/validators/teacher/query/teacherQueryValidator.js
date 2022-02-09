"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherQueryValidator = void 0;
const AbstractQueryValidator_1 = require("../../abstractions/AbstractQueryValidator");
class TeacherQueryValidator extends AbstractQueryValidator_1.AbstractQueryValidator {
    _initValidationSchemas = () => {
        this._queryValidationSchema = this._joi.object().keys({
            teachingLanguages: this._joi.array().items(this._joi.string()),
            alsoSpeaks: this._joi.array().items(this._joi.string()),
            teacherType: this._joi.array().items(this._joi.string()),
            minPrice: this._joi.number().min(0),
            maxPrice: this._joi.number().min(0),
            teacherTags: this._joi.array().items(this._joi.string()),
            packageTags: this._joi.array().items(this._joi.string()),
            lessonDurations: this._joi.array().items(this._joi.number().valid(30, 60, 90, 120)).unique(),
            contactMethodName: this._joi.array().items(this._joi.string()),
            contactMethodType: this._joi.array().items(this._joi.string()),
            name: this._joi.string(),
            page: this._joi.number().max(1000),
            limit: this._joi.number().max(1000),
        });
    };
}
exports.TeacherQueryValidator = TeacherQueryValidator;
