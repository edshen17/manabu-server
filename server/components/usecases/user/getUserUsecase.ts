import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

class GetUserUsecase implements IUsecase {
  private userDbService!: UserDbService;

  public init = async (services: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    this.userDbService = await services.makeUserDbService;
    return this;
  };

  public makeRequest = async (
    controllerData: ControllerData
  ): Promise<JoinedUserDoc | undefined> => {
    const { routeData, currentAPIUser, endpointPath } = controllerData;
    const { params } = routeData;
    if (params.uId || currentAPIUser.userId) {
      const id: string = endpointPath == '/me' ? currentAPIUser.userId : params.uId;
      const accessOptions: AccessOptions = {
        isProtectedResource: false,
        isCurrentAPIUserPermitted: true,
        currentAPIUserRole: currentAPIUser.role || undefined,
        isSelf: params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId,
      };

      const user = await this.userDbService.findById({
        id,
        accessOptions,
      });
      return user;
    }
  };
}

export { GetUserUsecase };
