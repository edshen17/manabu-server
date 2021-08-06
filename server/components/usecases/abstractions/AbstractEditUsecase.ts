import {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_MODES,
} from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractUsecase } from './AbstractUsecase';
import { ControllerData } from './IUsecase';

type AbstractEditUsecaseInitParams<OptionalUsecaseInitParams> = {
  makeEditEntityValidator: AbstractEntityValidator;
} & OptionalUsecaseInitParams;

abstract class AbstractEditUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse
> extends AbstractUsecase<
  AbstractEditUsecaseInitParams<OptionalUsecaseInitParams>,
  UsecaseResponse
> {
  protected _editEntityValidator!: AbstractEntityValidator;

  protected _isValidRouteDataTemplate = (controllerData: ControllerData): void => {
    const { routeData, currentAPIUser } = controllerData;
    const { role } = currentAPIUser;
    const { body } = routeData;
    this._editEntityValidator.validate({
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.EDIT,
      userRole: role,
      buildParams: body,
    });
  };
}

export { AbstractEditUsecase, AbstractEditUsecaseInitParams };
