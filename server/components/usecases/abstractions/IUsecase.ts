type CurrentAPIUser = {
  userId: string | undefined;
  role: string | undefined;
  isVerified: boolean;
};

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  endpointPath?: string;
  routeData: { params: any; body: any };
};

interface IUsecase {
  makeRequest: (controllerData: ControllerData) => Promise<any>;
  build: (services: any) => Promise<this>;
}

export { CurrentAPIUser, ControllerData, IUsecase };
