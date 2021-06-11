import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { ControllerData, CurrentAPIUser, IUsecase } from '../abstractions/IUsecase';

type GetUserUsecaseResponse = JoinedUserDoc | undefined | Error;

class GetUserUsecase implements IUsecase<GetUserUsecaseResponse> {
  private userDbService!: UserDbService;

  private _getUser = async (
    currentAPIUser: CurrentAPIUser,
    endpointPath: string,
    params: any,
    accessOptions: AccessOptions
  ): Promise<JoinedUserDoc> => {
    const _id: string = endpointPath == '/self/me' ? currentAPIUser.userId : params.uId;

    const user = await this.userDbService.findById({
      _id,
      accessOptions,
    });
    return user;
  };

  private _updateOnlineTimestamp = async (
    _id: string | undefined,
    accessOptions: AccessOptions
  ): Promise<void> => {
    this.userDbService.update({
      searchQuery: {
        _id,
      },
      updateParams: {
        lastOnline: new Date(),
      },
      accessOptions,
    });
  };

  public init = async (services: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    this.userDbService = await services.makeUserDbService;
    return this;
  };

  public makeRequest = async (controllerData: ControllerData): Promise<GetUserUsecaseResponse> => {
    const { routeData, currentAPIUser, endpointPath } = controllerData;
    const { params } = routeData;
    const searchIdExists: string = params.uId || currentAPIUser.userId;
    const accessOptions: AccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: currentAPIUser.role || 'user',
      isSelf: params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId,
    };

    if (searchIdExists) {
      const user = await this._getUser(currentAPIUser, endpointPath, params, accessOptions);
      if (user) {
        if (endpointPath == '/self/me') {
          this._updateOnlineTimestamp(currentAPIUser.userId, accessOptions);
        }
        return user;
      } else {
        throw new Error('User not found.');
      }
    }
  };
}

export { GetUserUsecase, GetUserUsecaseResponse };
