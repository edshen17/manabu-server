"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionCheckoutEntityValidator = void 0;
const AbstractEntityValidator_1 = require("../../../abstractions/AbstractEntityValidator");
class PackageTransactionCheckoutEntityValidator extends AbstractEntityValidator_1.AbstractEntityValidator {
    _initValidationSchemas = () => {
        this._createValidationSchema = this._joi.object().keys({
            teacherId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
            packageId: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
            lessonDuration: this._joi.number().valid(30, 60, 90, 120),
            lessonLanguage: this._joi.string().max(5),
            timeslots: this._joi
                .array()
                .items({
                startDate: this._joi.date(),
                endDate: this._joi.date(),
            })
                .max(60),
        });
        this._editValidationSchema = this._createValidationSchema;
        this._deleteValidationSchema = this._createValidationSchema;
        this._adminValidationSchema = this._editValidationSchema;
    };
}
exports.PackageTransactionCheckoutEntityValidator = PackageTransactionCheckoutEntityValidator;
