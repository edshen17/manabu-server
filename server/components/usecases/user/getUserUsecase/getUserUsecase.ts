import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData, CurrentAPIUser } from '../../abstractions/IUsecase';

type GetUserUsecaseInitParams = { makeUserDbService: Promise<UserDbService> };
type GetUserUsecaseResponse = { user: JoinedUserDoc } | Error | undefined;

class GetUserUsecase extends AbstractGetUsecase<GetUserUsecaseInitParams, GetUserUsecaseResponse> {
  private _userDbService!: UserDbService;

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { routeData, currentAPIUser } = controllerData;
    const { params } = routeData;
    const searchIdExists = params.uId || currentAPIUser.userId;
    return searchIdExists;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetUserUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions } = props;
    const user = await this._getUser(currentAPIUser, endpointPath, params, dbServiceAccessOptions);
    if (user) {
      if (endpointPath == '/self/me') {
        this._updateOnlineTimestamp(currentAPIUser.userId, dbServiceAccessOptions);
      }
      return { user };
    } else {
      throw new Error('User not found.');
    }
  };

  private _getUser = async (
    currentAPIUser: CurrentAPIUser,
    endpointPath: string,
    params: any,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<JoinedUserDoc> => {
    const _id: string = endpointPath == '/self/me' ? currentAPIUser.userId : params.uId;
    const user = await this._userDbService.findById({
      _id,
      dbServiceAccessOptions,
    });
    return user;
  };

  private _updateOnlineTimestamp = async (
    _id: string | undefined,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<void> => {
    this._userDbService.findOneAndUpdate({
      searchQuery: {
        _id,
      },
      updateParams: {
        lastOnline: new Date(),
      },
      dbServiceAccessOptions,
    });
  };

  public init = async (usecaseInitParams: GetUserUsecaseInitParams): Promise<this> => {
    const { makeUserDbService } = usecaseInitParams;
    this._userDbService = await makeUserDbService;
    return this;
  };
}

export { GetUserUsecase, GetUserUsecaseResponse };
