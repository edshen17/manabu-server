import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

class PutUserUsecase implements IUsecase {
  private userDbService!: UserDbService;

  public init = async (services: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    this.userDbService = await services.makeUserDbService;
    return this;
  };

  private _isValidBody = (body: JoinedUserDoc): any => {
    const { role, _id, dateRegistered } = body;
    return !role && !_id && !dateRegistered;
  };

  public makeRequest = async (controllerData: ControllerData): Promise<JoinedUserDoc | Error> => {
    const { routeData, currentAPIUser } = controllerData;
    const { body, params } = routeData;
    const isCurrentAPIUserPermitted =
      params.uId == currentAPIUser.userId || currentAPIUser.role == 'admin';
    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: params.uId == currentAPIUser.userId,
    };
    const isValidUpdate = currentAPIUser.role == 'admin' || this._isValidBody(body);

    if (isValidUpdate) {
      const user = await this.userDbService.update({
        searchQuery: { _id: params.uId },
        updateParams: body,
        accessOptions,
      });
      return user;
    } else {
      throw new Error('You do not have the permissions to update those properties.');
    }
  };
}

export { PutUserUsecase };
