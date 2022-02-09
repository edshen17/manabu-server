import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractUsecase } from './AbstractUsecase';
import { ControllerData } from './IUsecase';
declare type AbstractEditUsecaseInitParams<OptionalUsecaseInitParams> = {
    makeEditEntityValidator: AbstractEntityValidator;
} & OptionalUsecaseInitParams;
declare type AbstractEditUsecaseInitTemplateParams<OptionalUsecaseInitParams> = Omit<AbstractEditUsecaseInitParams<OptionalUsecaseInitParams>, 'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService' | 'deepEqual'>;
declare abstract class AbstractEditUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> extends AbstractUsecase<AbstractEditUsecaseInitParams<OptionalUsecaseInitParams>, UsecaseResponse, DbServiceResponse> {
    protected _editEntityValidator: AbstractEntityValidator;
    protected _isValidRouteDataTemplate: (controllerData: ControllerData) => void;
    protected _initTemplate: (optionalInitParams: AbstractEditUsecaseInitTemplateParams<OptionalUsecaseInitParams>) => Promise<void>;
}
export { AbstractEditUsecase, AbstractEditUsecaseInitParams, AbstractEditUsecaseInitTemplateParams, };
