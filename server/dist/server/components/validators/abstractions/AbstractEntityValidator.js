"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTITY_VALIDATOR_VALIDATE_MODE = exports.ENTITY_VALIDATOR_VALIDATE_USER_ROLE = exports.AbstractEntityValidator = void 0;
const AbstractValidator_1 = require("./AbstractValidator");
var ENTITY_VALIDATOR_VALIDATE_USER_ROLE;
(function (ENTITY_VALIDATOR_VALIDATE_USER_ROLE) {
    ENTITY_VALIDATOR_VALIDATE_USER_ROLE["USER"] = "user";
    ENTITY_VALIDATOR_VALIDATE_USER_ROLE["TEACHER"] = "teacher";
    ENTITY_VALIDATOR_VALIDATE_USER_ROLE["ADMIN"] = "admin";
})(ENTITY_VALIDATOR_VALIDATE_USER_ROLE || (ENTITY_VALIDATOR_VALIDATE_USER_ROLE = {}));
exports.ENTITY_VALIDATOR_VALIDATE_USER_ROLE = ENTITY_VALIDATOR_VALIDATE_USER_ROLE;
var ENTITY_VALIDATOR_VALIDATE_MODE;
(function (ENTITY_VALIDATOR_VALIDATE_MODE) {
    ENTITY_VALIDATOR_VALIDATE_MODE["CREATE"] = "create";
    ENTITY_VALIDATOR_VALIDATE_MODE["EDIT"] = "edit";
    ENTITY_VALIDATOR_VALIDATE_MODE["DELETE"] = "delete";
    ENTITY_VALIDATOR_VALIDATE_MODE["QUERY"] = "query";
    ENTITY_VALIDATOR_VALIDATE_MODE["PARAMS"] = "params";
})(ENTITY_VALIDATOR_VALIDATE_MODE || (ENTITY_VALIDATOR_VALIDATE_MODE = {}));
exports.ENTITY_VALIDATOR_VALIDATE_MODE = ENTITY_VALIDATOR_VALIDATE_MODE;
class AbstractEntityValidator extends AbstractValidator_1.AbstractValidator {
    _createValidationSchema;
    _editValidationSchema;
    _deleteValidationSchema;
    _adminValidationSchema;
    _validateProps = (props) => {
        const { validationMode, userRole, buildParams } = props;
        let validatedProps;
        if (userRole == ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN) {
            validatedProps = this._adminValidationSchema.validate(buildParams);
        }
        else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODE.CREATE) {
            validatedProps = this._createValidationSchema.validate(buildParams);
        }
        else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODE.EDIT) {
            validatedProps = this._editValidationSchema.validate(buildParams);
        }
        else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODE.DELETE) {
            validatedProps = this._deleteValidationSchema.validate(buildParams);
        }
        else {
            validatedProps = {
                error: 'Unsupported function argument.',
            };
        }
        return validatedProps;
    };
}
exports.AbstractEntityValidator = AbstractEntityValidator;
