import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  endpointPath: string;
  routeData: RouteData;
};

type RouteData = { params: any; body: any; query: any };

type UsecaseInitParams<OptionalUsecaseInitParams, DbService> =
  RequiredUsecaseInitParams<DbService> & OptionalUsecaseInitParams;

type RequiredUsecaseInitParams<DbService> = {
  makeQueryValidator: AbstractQueryValidator;
  makeParamsValidator: AbstractParamsValidator;
  cloneDeep: any;
  makeDbService: Promise<DbService>;
};

interface IUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbService> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (
    usecaseInitParams: UsecaseInitParams<OptionalUsecaseInitParams, DbService>
  ) => Promise<this>;
}

export { ControllerData, IUsecase, RouteData, UsecaseInitParams };
