/// <reference types="custom" />
import { StringKeyObject } from '../../../types/custom';
import { IDbService } from '../../dataAccess/abstractions/IDbService';
import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
declare type ControllerData = {
    currentAPIUser: CurrentAPIUser;
    routeData: RouteData;
};
declare type RouteData = {
    params: StringKeyObject;
    body: StringKeyObject;
    query: StringKeyObject;
    endpointPath: string;
    headers: StringKeyObject;
    rawBody: StringKeyObject;
};
declare type UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse> = RequiredUsecaseInitParams<DbServiceResponse> & OptionalUsecaseInitParams;
declare type RequiredUsecaseInitParams<DbServiceResponse> = {
    makeQueryValidator: AbstractQueryValidator;
    makeParamsValidator: AbstractParamsValidator;
    cloneDeep: any;
    deepEqual: any;
    makeDbService: Promise<IDbService<any, DbServiceResponse>>;
};
interface IUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
    makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
    init: (usecaseInitParams: UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse>) => Promise<this>;
}
export { ControllerData, IUsecase, RouteData, UsecaseInitParams };
