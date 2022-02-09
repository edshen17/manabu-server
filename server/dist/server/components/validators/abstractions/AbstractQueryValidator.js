"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractQueryValidator = void 0;
const AbstractValidator_1 = require("./AbstractValidator");
class AbstractQueryValidator extends AbstractValidator_1.AbstractValidator {
    _queryValidationSchema;
    _validateProps = (props) => {
        const { query } = props;
        const validatedProps = this._queryValidationSchema.validate(query);
        return validatedProps;
    };
}
exports.AbstractQueryValidator = AbstractQueryValidator;
