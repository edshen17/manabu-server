import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractUsecase } from './AbstractUsecase';
import { ControllerData } from './IUsecase';
declare type AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams> = {
    makeDeleteEntityValidator: AbstractEntityValidator;
} & OptionalUsecaseInitParams;
declare abstract class AbstractDeleteUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> extends AbstractUsecase<AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams>, UsecaseResponse, DbServiceResponse> {
    protected _deleteEntityValidator: AbstractEntityValidator;
    protected _isValidRouteDataTemplate: (controllerData: ControllerData) => void;
    protected _initTemplate: (optionalInitParams: Omit<AbstractDeleteUsecaseInitParams<OptionalUsecaseInitParams>, 'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService' | 'deepEqual'>) => Promise<void>;
}
export { AbstractDeleteUsecase, AbstractDeleteUsecaseInitParams };
