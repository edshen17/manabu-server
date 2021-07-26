import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetUserUsecaseInitParams = { makeUserDbService: Promise<UserDbService> };
type GetUserUsecaseResponse = { user: JoinedUserDoc };

class GetUserUsecase extends AbstractGetUsecase<
  OptionalGetUserUsecaseInitParams,
  GetUserUsecaseResponse
> {
  private _userDbService!: UserDbService;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetUserUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions } = props;
    const isSelf = this._isSelf({ params, currentAPIUser, endpointPath });
    const _id: string = isSelf ? currentAPIUser.userId : params.userId;
    const user = await this._getUser({
      _id,
      dbServiceAccessOptions,
    });
    if (!user) {
      throw new Error('User not found.');
    }
    if (isSelf) {
      this._updateOnlineTimestamp({ _id, dbServiceAccessOptions });
    }
    return { user };
  };

  private _getUser = async (props: {
    _id: string;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { _id, dbServiceAccessOptions } = props;
    const user = await this._userDbService.findById({
      _id,
      dbServiceAccessOptions,
    });
    return user;
  };

  private _updateOnlineTimestamp = async (props: {
    _id?: string;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { _id, dbServiceAccessOptions } = props;
    await this._userDbService.findOneAndUpdate({
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
