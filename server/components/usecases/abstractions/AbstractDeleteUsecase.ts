import {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_MODE,
} from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractUsecase } from './AbstractUsecase';
import { ControllerData } from './IUsecase';

type AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams> = {
  makeDeleteEntityValidator: AbstractEntityValidator;
} & OptionalUsecaseInitParams;

abstract class AbstractDeleteUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbServiceResponse
> extends AbstractUsecase<
  AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams>,
  UsecaseResponse,
  DbServiceResponse
> {
  protected _deleteEntityValidator!: AbstractEntityValidator;

  protected _isValidRouteDataTemplate = (controllerData: ControllerData): void => {
    const { routeData, currentAPIUser } = controllerData;
    const { role } = currentAPIUser;
    const { body } = routeData;
    this._deleteEntityValidator.validate({
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.DELETE,
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
