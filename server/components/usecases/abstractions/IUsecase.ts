import { IDbOperations } from '../../dataAccess/abstractions/IDbOperations';

type CurrentAPIUser = {
  userId: string;
  role: string;
  isVerified: boolean;
};

type ControllerData = {
  currentAPIUser: CurrentAPIUser;
  endpointPath: string;
  routeData: { params: any };
};

interface IUsecase<DbDoc> {
  makeRequest: (controllerData: ControllerData) => Promise<DbDoc>;
  build: (makeDbService: IDbOperations<DbDoc>) => Promise<this>;
}

export { CurrentAPIUser, ControllerData, IUsecase };
