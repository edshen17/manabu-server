import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { AbstractUsecase } from '../abstractions/AbstractUsecase';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

class GetUserUsecase<JoinedUserDoc>
  extends AbstractUsecase<JoinedUserDoc>
  implements IUsecase<JoinedUserDoc>
{
  private userDbService!: UserDbService;

  public makeRequest = async (
    controllerData: ControllerData
  ): Promise<JoinedUserDoc | undefined> => {
    const { routeData, currentAPIUser, endpointPath } = controllerData;
    const { routeParams } = routeData;
    if (routeParams.uId || currentAPIUser.userId) {
      const idToSearch: string =
        endpointPath == '/me' ? currentAPIUser.userId : otherData.routeParams.uId;
      const accessOptions: AccessOptions = {
        isProtectedResource: false,
        isCurrentAPIUserPermitted: true,
        currentAPIUserRole: currentAPIUser.role,
        isSelf: routeParams.uId == currentAPIUser.userId,
        rolePermissions: { teacher: {}, admin: {}, user: {} },
      };

      const user = await this.userDbService.findById({
        searchQuery: { id: idToSearch },
        accessOptions,
      });
      return user;
    }
  };
}

export { GetUserUsecase };
