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
};

type UsecaseInitParams<OptionalUsecaseInitParams, DbDoc> = RequiredUsecaseInitParams<DbDoc> &
  OptionalUsecaseInitParams;

type RequiredUsecaseInitParams<DbDoc> = {
  makeQueryValidator: AbstractQueryValidator;
  makeParamsValidator: AbstractParamsValidator;
  cloneDeep: any;
  deepEqual: any;
  makeDbService: Promise<IDbService<any, DbDoc>>;
};

interface IUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbDoc> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (usecaseInitParams: UsecaseInitParams<OptionalUsecaseInitParams, DbDoc>) => Promise<this>;
}

export { ControllerData, IUsecase, RouteData, UsecaseInitParams };
