"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractParamsValidator = void 0;
const AbstractValidator_1 = require("./AbstractValidator");
class AbstractParamsValidator extends AbstractValidator_1.AbstractValidator {
    _paramsValidationSchema;
    _validateProps = (props) => {
        const { params } = props;
        const validatedProps = this._paramsValidationSchema.validate(params);
        return validatedProps;
    };
}
exports.AbstractParamsValidator = AbstractParamsValidator;
