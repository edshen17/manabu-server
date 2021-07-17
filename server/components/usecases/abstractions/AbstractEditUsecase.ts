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

  constructor() {
    super('Access denied.');
  }

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { routeData, currentAPIUser } = controllerData;
    const { body } = routeData;
    const { role } = currentAPIUser;
    const isValidRequest =
      this._isValidRouteData(routeData) && this._isValidEdit({ buildParams: body, userRole: role });
    return isValidRequest;
  };

  protected _isValidEdit = (props: { buildParams: {}; userRole: string }): boolean => {
    let isValidEdit: boolean;
    try {
      const { buildParams, userRole } = props;
      this._editEntityValidator.validate({
        validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.EDIT,
        userRole,
        buildParams,
      });
      isValidEdit = true;
    } catch (err) {
      isValidEdit = false;
    }
    return isValidEdit;
  };
}

export { AbstractEditUsecase, AbstractEditUsecaseInitParams };
