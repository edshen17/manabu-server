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

interface IUsecase<UsecaseResponse> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (services: any) => Promise<this>;
}

export { CurrentAPIUser, ControllerData, IUsecase, RouteData };
