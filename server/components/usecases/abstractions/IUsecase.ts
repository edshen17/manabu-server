import { IDbService } from '../../dataAccess/abstractions/IDbService';
import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  endpointPath: string;
  routeData: RouteData;
};

type RouteData = { params: any; body: any; query: any };

type UsecaseInitParams<OptionalUsecaseInitParams> = RequiredUsecaseInitParams &
  OptionalUsecaseInitParams;

type RequiredUsecaseInitParams = {
  makeQueryValidator: AbstractQueryValidator;
  makeParamsValidator: AbstractParamsValidator;
  cloneDeep: any;
  deepEqual: any;
  makeDbService: Promise<IDbService<any, any>>;
};

interface IUsecase<OptionalUsecaseInitParams, UsecaseResponse> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (usecaseInitParams: UsecaseInitParams<OptionalUsecaseInitParams>) => Promise<this>;
}

export { ControllerData, IUsecase, RouteData, UsecaseInitParams };
