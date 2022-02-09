"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableTimeEntityValidator = void 0;
const AbstractEntityValidator_1 = require("../../abstractions/AbstractEntityValidator");
class AvailableTimeEntityValidator extends AbstractEntityValidator_1.AbstractEntityValidator {
    _initValidationSchemas = () => {
        this._createValidationSchema = this._joi.object().keys({
            hostedById: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
            startDate: this._joi.date(),
            endDate: this._joi.date(),
            createdDate: this._joi.date(),
            lastModifiedDate: this._joi.date(),
        });
        this._editValidationSchema = this._createValidationSchema.keys({
            hostedById: this._joi.forbidden(),
            createdDate: this._joi.forbidden(),
            lastModifiedDate: this._joi.forbidden(),
        });
        this._deleteValidationSchema = this._createValidationSchema.keys({
            _id: this._joi
                .alternatives()
                .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
        });
        this._adminValidationSchema = this._editValidationSchema;
    };
}
exports.AvailableTimeEntityValidator = AvailableTimeEntityValidator;
