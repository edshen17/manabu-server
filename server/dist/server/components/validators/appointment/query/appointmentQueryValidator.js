"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentQueryValidator = void 0;
const AbstractQueryValidator_1 = require("../../abstractions/AbstractQueryValidator");
class AppointmentQueryValidator extends AbstractQueryValidator_1.AbstractQueryValidator {
    _initValidationSchemas = () => {
        this._queryValidationSchema = this._joi.object().keys({
            startDate: this._joi.date(),
            endDate: this._joi.date(),
            page: this._joi.number().max(1000),
            limit: this._joi.number().max(1000),
        });
    };
}
exports.AppointmentQueryValidator = AppointmentQueryValidator;
