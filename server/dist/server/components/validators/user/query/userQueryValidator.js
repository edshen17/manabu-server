"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQueryValidator = void 0;
const AbstractQueryValidator_1 = require("../../abstractions/AbstractQueryValidator");
class UserQueryValidator extends AbstractQueryValidator_1.AbstractQueryValidator {
    _initValidationSchemas = () => {
        this._queryValidationSchema = this._joi.object().keys({
            // google query strings
            code: this._joi.string(),
            scope: this._joi.string(),
            authuser: this._joi.string(),
            prompt: this._joi.string(),
            hd: this._joi.string(),
            state: this._joi.object({
                redirectUserId: this._joi.string().alphanum().min(24).max(24),
                isTeacherApp: this._joi.boolean(),
            }),
        });
    };
}
exports.UserQueryValidator = UserQueryValidator;
