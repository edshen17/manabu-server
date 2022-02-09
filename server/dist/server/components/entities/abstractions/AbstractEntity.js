"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEntity = void 0;
const AbstractEntityValidator_1 = require("../../validators/abstractions/AbstractEntityValidator");
class AbstractEntity {
    _entityValidator;
    build = (buildParams) => {
        this._validate(buildParams);
        const builtEntity = this._buildTemplate(buildParams);
        return builtEntity;
    };
    _validate = (buildParams) => {
        this._entityValidator.validate({
            buildParams,
            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
        });
    };
    init = async (initParams) => {
        const { makeEntityValidator, ...optionalInitParams } = initParams;
        this._entityValidator = makeEntityValidator;
        await this._initTemplate(optionalInitParams);
        return this;
    };
    _initTemplate = (optionalInitParams) => {
        return;
    };
}
exports.AbstractEntity = AbstractEntity;
