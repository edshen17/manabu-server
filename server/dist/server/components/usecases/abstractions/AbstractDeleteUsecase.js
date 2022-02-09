"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDeleteUsecase = void 0;
const AbstractEntityValidator_1 = require("../../validators/abstractions/AbstractEntityValidator");
const AbstractUsecase_1 = require("./AbstractUsecase");
class AbstractDeleteUsecase extends AbstractUsecase_1.AbstractUsecase {
    _deleteEntityValidator;
    _isValidRouteDataTemplate = (controllerData) => {
        const { routeData, currentAPIUser } = controllerData;
        const { role } = currentAPIUser;
        const { body } = routeData;
        this._deleteEntityValidator.validate({
            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.DELETE,
            userRole: role,
            buildParams: body,
        });
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeDeleteEntityValidator } = optionalInitParams;
        this._deleteEntityValidator = makeDeleteEntityValidator;
    };
}
exports.AbstractDeleteUsecase = AbstractDeleteUsecase;
