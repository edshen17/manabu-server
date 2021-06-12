type CurrentAPIUser = {
  userId?: string;
  role: string;
  isVerified: boolean;
};

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  endpointPath: string;
  routeData: { params: any; body: any; query?: any };
};

interface IUsecase<UsecaseResponse> {
  makeRequest: (controllerData: ControllerData) => Promise<UsecaseResponse>;
  init: (services: any) => Promise<this>;
}

export { CurrentAPIUser, ControllerData, IUsecase };
