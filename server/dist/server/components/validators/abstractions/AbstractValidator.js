"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractValidator = void 0;
class AbstractValidator {
    _joi;
    validate = (props) => {
        const validationObj = this._validateProps(props);
        if ('error' in validationObj) {
            const errMessage = validationObj.error;
            throw new Error(errMessage);
        }
        else {
            const validatedProps = validationObj.value;
            return validatedProps;
        }
    };
    init = (initParams) => {
        const { joi, ...optionalInitParams } = initParams;
        this._joi = joi;
        this._initTemplate(optionalInitParams);
        this._initValidationSchemas();
        return this;
    };
    _initTemplate = (optionalInitParams) => {
        return;
    };
}
exports.AbstractValidator = AbstractValidator;
