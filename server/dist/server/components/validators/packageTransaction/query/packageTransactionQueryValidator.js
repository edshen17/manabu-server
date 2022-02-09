"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionQueryValidator = void 0;
const AbstractQueryValidator_1 = require("../../abstractions/AbstractQueryValidator");
class PackageTransactionQueryValidator extends AbstractQueryValidator_1.AbstractQueryValidator {
    _initValidationSchemas = () => {
        this._queryValidationSchema = this._joi.object().keys({
            token: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId(), this._joi.string().max(2048)),
            paymentId: this._joi.string().max(2048).allow(''),
            startDate: this._joi.date(),
            endDate: this._joi.date(),
        });
    };
}
exports.PackageTransactionQueryValidator = PackageTransactionQueryValidator;
