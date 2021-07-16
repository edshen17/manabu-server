import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';

type CurrentAPIUser = {
  userId?: string;
  role: string;
};

type RouteData = { params: any; body: any; query: any };

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  endpointPath: string;
  routeData: RouteData;
};

type UsecaseInitParams<OptionalUsecaseInitParams> = RequiredUsecaseInitParams &
  OptionalUsecaseInitParams;

type RequiredUsecaseInitParams = {
  makeQueryValidator: AbstractQueryValidator;
  makeParamsValidator: AbstractParamsValidator;
};

interface IUsecase<OptionalUsecaseInitParams, UsecaseResponse> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (usecaseInitParams: UsecaseInitParams<OptionalUsecaseInitParams>) => Promise<this>;
}

export { CurrentAPIUser, ControllerData, IUsecase, RouteData, UsecaseInitParams };
