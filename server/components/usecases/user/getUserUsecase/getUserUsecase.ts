import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetUserUsecaseInitParams = { makeUserDbService: Promise<UserDbService> };
type GetUserUsecaseResponse = { user: JoinedUserDoc } | Error | undefined;

class GetUserUsecase extends AbstractGetUsecase<
  OptionalGetUserUsecaseInitParams,
  GetUserUsecaseResponse
> {
  private _userDbService!: UserDbService;

  protected _isProtectedResource = () => {
    return false;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetUserUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions } = props;
    const isSelf = this._isSelf({ params, currentAPIUser, endpointPath });
    const user = await this._getUser(currentAPIUser, endpointPath, params, dbServiceAccessOptions);

    if (user) {
      if (isSelf) {
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
      updateQuery: {
        lastOnline: new Date(),
      },
      dbServiceAccessOptions,
    });
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetUserUsecaseInitParams
  ): Promise<void> => {
    const { makeUserDbService } = optionalInitParams;
    this._userDbService = await makeUserDbService;
  };
}

export { GetUserUsecase, GetUserUsecaseResponse };
