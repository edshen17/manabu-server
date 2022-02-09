"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionParamsValidator = void 0;
const AbstractParamsValidator_1 = require("../../abstractions/AbstractParamsValidator");
class PackageTransactionParamsValidator extends AbstractParamsValidator_1.AbstractParamsValidator {
    _initValidationSchemas = () => {
        this._paramsValidationSchema = this._joi.object().keys({
            packageTransactionId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        });
    };
}
exports.PackageTransactionParamsValidator = PackageTransactionParamsValidator;
