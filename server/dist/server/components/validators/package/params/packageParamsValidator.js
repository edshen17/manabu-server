"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageParamsValidator = void 0;
const AbstractParamsValidator_1 = require("../../abstractions/AbstractParamsValidator");
class PackageParamsValidator extends AbstractParamsValidator_1.AbstractParamsValidator {
    _initValidationSchemas = () => {
        this._paramsValidationSchema = this._joi.object().keys({
            packageId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        });
    };
}
exports.PackageParamsValidator = PackageParamsValidator;
