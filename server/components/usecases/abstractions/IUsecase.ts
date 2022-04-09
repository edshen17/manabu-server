import { StringKeyObject } from '../../../types/custom';
import { IDbService } from '../../dataAccess/abstractions/IDbService';
import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  routeData: RouteData;
};

type RouteData = {
  params: StringKeyObject;
  body: StringKeyObject;
  query: StringKeyObject;
  endpointPath: string;
  headers: StringKeyObject;
  rawBody: StringKeyObject;
  cookies: StringKeyObject;
};

type UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse> =
  RequiredUsecaseInitParams<DbServiceResponse> & OptionalUsecaseInitParams;

type RequiredUsecaseInitParams<DbServiceResponse> = {
  makeQueryValidator: AbstractQueryValidator;
  makeParamsValidator: AbstractParamsValidator;
  cloneDeep: any;
  deepEqual: any;
  makeDbService: Promise<IDbService<any, DbServiceResponse>>;
};

interface IUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (
    usecaseInitParams: UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse>
  ) => Promise<this>;
}

export { ControllerData, IUsecase, RouteData, UsecaseInitParams };
