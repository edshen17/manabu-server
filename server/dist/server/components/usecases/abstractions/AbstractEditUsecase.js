"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEditUsecase = void 0;
const AbstractEntityValidator_1 = require("../../validators/abstractions/AbstractEntityValidator");
const AbstractUsecase_1 = require("./AbstractUsecase");
class AbstractEditUsecase extends AbstractUsecase_1.AbstractUsecase {
    _editEntityValidator;
    _isValidRouteDataTemplate = (controllerData) => {
        const { routeData, currentAPIUser } = controllerData;
        const { role } = currentAPIUser;
        const { body } = routeData;
        this._editEntityValidator.validate({
            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
            userRole: role,
            buildParams: body,
        });
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeEditEntityValidator } = optionalInitParams;
        this._editEntityValidator = makeEditEntityValidator;
    };
}
exports.AbstractEditUsecase = AbstractEditUsecase;
