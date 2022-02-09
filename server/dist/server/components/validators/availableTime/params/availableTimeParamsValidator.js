"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableTimeParamsValidator = void 0;
const AbstractParamsValidator_1 = require("../../abstractions/AbstractParamsValidator");
class AvailableTimeParamsValidator extends AbstractParamsValidator_1.AbstractParamsValidator {
    _initValidationSchemas = () => {
        this._paramsValidationSchema = this._joi.object().keys({
            availableTimeId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        });
    };
}
exports.AvailableTimeParamsValidator = AvailableTimeParamsValidator;
