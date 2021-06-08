type CurrentAPIUser = {
  userId?: string;
  role: string;
  isVerified: boolean;
};

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  endpointPath?: string;
  routeData: { params: any; body: any };
};

interface IUsecase {
  makeRequest: (controllerData: ControllerData) => Promise<any>;
  init: (services: any) => Promise<this>;
}

export { CurrentAPIUser, ControllerData, IUsecase };
