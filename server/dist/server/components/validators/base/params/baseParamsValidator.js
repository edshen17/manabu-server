"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseParamsValidator = void 0;
const AbstractParamsValidator_1 = require("../../abstractions/AbstractParamsValidator");
class BaseParamsValidator extends AbstractParamsValidator_1.AbstractParamsValidator {
    _initValidationSchemas = () => {
        this._paramsValidationSchema = this._joi.object().keys({});
    };
}
exports.BaseParamsValidator = BaseParamsValidator;
