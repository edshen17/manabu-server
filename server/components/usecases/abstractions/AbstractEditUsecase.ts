import {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_MODE,
} from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractUsecase } from './AbstractUsecase';
import { ControllerData } from './IUsecase';

type AbstractEditUsecaseInitParams<OptionalUsecaseInitParams> = {
  makeEditEntityValidator: AbstractEntityValidator;
} & OptionalUsecaseInitParams;

type AbstractEditUsecaseInitTemplateParams<OptionalUsecaseInitParams> = Omit<
  AbstractEditUsecaseInitParams<OptionalUsecaseInitParams>,
  'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService' | 'deepEqual'
>;

abstract class AbstractEditUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbServiceResponse
> extends AbstractUsecase<
  AbstractEditUsecaseInitParams<OptionalUsecaseInitParams>,
  UsecaseResponse,
  DbServiceResponse
> {
  protected _editEntityValidator!: AbstractEntityValidator;

  protected _isValidRouteDataTemplate = (controllerData: ControllerData): void => {
    const { routeData, currentAPIUser } = controllerData;
    const { role } = currentAPIUser;
    const { body } = routeData;
    this._editEntityValidator.validate({
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.EDIT,
      userRole: role,
      buildParams: body,
    });
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitTemplateParams<OptionalUsecaseInitParams>
  ): Promise<void> => {
    const { makeEditEntityValidator } = optionalInitParams;
    this._editEntityValidator = makeEditEntityValidator;
  };
}

export {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
  AbstractEditUsecaseInitTemplateParams,
};
