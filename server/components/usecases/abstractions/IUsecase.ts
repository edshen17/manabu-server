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

interface IUsecase<UsecaseInitParams, UsecaseResponse> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (usecaseInitParams: UsecaseInitParams) => Promise<this>;
}

export { CurrentAPIUser, ControllerData, IUsecase, RouteData };
