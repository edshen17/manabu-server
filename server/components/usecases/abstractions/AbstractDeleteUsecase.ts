import {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_MODES,
} from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractUsecase } from './AbstractUsecase';
import { ControllerData } from './IUsecase';

type AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams> = {
  makeDeleteEntityValidator: AbstractEntityValidator;
} & OptionalUsecaseInitParams;

abstract class AbstractDeleteUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbDoc
> extends AbstractUsecase<
  AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams>,
  UsecaseResponse,
  DbDoc
> {
  protected _deleteEntityValidator!: AbstractEntityValidator;

  protected _isValidRouteDataTemplate = (controllerData: ControllerData): void => {
    const { routeData, currentAPIUser } = controllerData;
    const { role } = currentAPIUser;
    const { body } = routeData;
    this._deleteEntityValidator.validate({
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.DELETE,
      userRole: role,
      buildParams: body,
    });
  };

  protected _initTemplate = async (
    optionalInitParams: Omit<
      AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams>,
      'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService' | 'deepEqual'
    >
  ) => {
    const { makeDeleteEntityValidator } = optionalInitParams;
    this._deleteEntityValidator = makeDeleteEntityValidator;
  };
}

export { AbstractDeleteUsecase, AbstractDeleteUsecaseInitParams };
