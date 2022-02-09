"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQueryValidator = void 0;
const AbstractQueryValidator_1 = require("../../abstractions/AbstractQueryValidator");
class BaseQueryValidator extends AbstractQueryValidator_1.AbstractQueryValidator {
    _initValidationSchemas = () => {
        this._queryValidationSchema = this._joi.object().keys({
            page: this._joi.number().max(100),
            limit: this._joi.number().max(100),
        });
    };
}
exports.BaseQueryValidator = BaseQueryValidator;
