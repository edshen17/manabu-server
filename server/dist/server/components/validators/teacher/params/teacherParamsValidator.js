"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherParamsValidator = void 0;
const AbstractParamsValidator_1 = require("../../abstractions/AbstractParamsValidator");
class TeacherParamsValidator extends AbstractParamsValidator_1.AbstractParamsValidator {
    _initValidationSchemas = () => {
        this._paramsValidationSchema = this._joi.object().keys({
            teacherId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        });
    };
}
exports.TeacherParamsValidator = TeacherParamsValidator;
