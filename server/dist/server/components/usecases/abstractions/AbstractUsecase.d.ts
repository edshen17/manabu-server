import { StringKeyObject } from '../../../types/custom';
import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerData, IUsecase, UsecaseInitParams } from './IUsecase';
declare type MakeRequestTemplateParams = {
    dbServiceAccessOptions: DbServiceAccessOptions;
    body: any;
    rawBody: any;
    isValidRequest: boolean;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    query: any;
    endpointPath: string;
    currentAPIUser: CurrentAPIUser;
    controllerData: ControllerData;
    headers: any;
};
declare type IsCurrentAPIUserPermittedParams = {
    isSelf: boolean;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
};
declare abstract class AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> implements IUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
    protected _queryValidator: AbstractQueryValidator;
    protected _paramsValidator: AbstractParamsValidator;
    protected _cloneDeep: any;
    protected _deepEqual: any;
    protected _dbService: IDbService<any, DbServiceResponse>;
    makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
    private _getMakeRequestTemplateParams;
    private _isCurrentAPIUserPermitted;
    protected _isSelf: (props: {
        params: any;
        currentAPIUser: CurrentAPIUser;
        endpointPath: string;
    }) => Promise<boolean>;
    private _isResourceOwner;
    protected _getResourceAccessData: () => StringKeyObject;
    private _processResourceOwnership;
    protected _isProtectedResource: (props: IsCurrentAPIUserPermittedParams) => boolean;
    private _isValidRequest;
    private _getDbServiceAccessOptions;
    protected abstract _makeRequestTemplate(props: MakeRequestTemplateParams): Promise<UsecaseResponse>;
    private _isValidRouteData;
    protected _isValidRouteDataTemplate: (controllerData: ControllerData) => void;
    init: (initParams: UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse>) => Promise<this>;
    protected _initTemplate: (optionalInitParams: Omit<UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse>, 'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService' | 'deepEqual'>) => Promise<void> | void;
}
export { AbstractUsecase, MakeRequestTemplateParams, IsCurrentAPIUserPermittedParams };
