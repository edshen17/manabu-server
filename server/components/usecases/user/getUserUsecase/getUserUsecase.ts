import { ObjectId } from 'mongoose';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CookieData, CookieHandler } from '../../utils/cookieHandler/cookieHandler';
import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';

type OptionalGetUserUsecaseInitParams = {
  makeCookieHandler: Promise<CookieHandler>;
  makeJwtHandler: Promise<JwtHandler>;
};
type GetUserUsecaseResponse = { user: JoinedUserDoc; cookies?: CookieData[] };

class GetUserUsecase extends AbstractGetUsecase<
  OptionalGetUserUsecaseInitParams,
  GetUserUsecaseResponse,
  UserDbServiceResponse
> {
  private _cookieHandler!: CookieHandler;
  private _jwtHandler!: JwtHandler;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetUserUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions } = props;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const _id = isSelf ? currentAPIUser.userId : params.userId;
    const user = await this._getUser({
      _id,
      dbServiceAccessOptions,
    });
    let cookies;
    if (!user) {
      throw new Error('User not found.');
    }
    if (isSelf) {
      this._updateOnlineTimestamp({ _id, dbServiceAccessOptions });
      cookies = await this._refreshJwt({ currentAPIUser, user });
    }
    return { user, cookies };
  };

  private _getUser = async (props: {
    _id: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { _id, dbServiceAccessOptions } = props;
    const user = await this._dbService.findById({
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
    await this._dbService.findOneAndUpdate({
      searchQuery: {
        _id,
      },
      updateQuery: {
        lastOnlineDate: new Date(),
      },
      dbServiceAccessOptions,
      preserveCache: true,
    });
  };

  private _refreshJwt = async (props: {
    user: JoinedUserDoc;
    currentAPIUser: CurrentAPIUser;
  }): Promise<CookieData[] | undefined> => {
    const { user, currentAPIUser } = props;
    const { token } = currentAPIUser;
    let cookies;
    if (token) {
      cookies = this._cookieHandler.splitLoginCookies(user);
      setTimeout(async () => {
        await this._jwtHandler.blacklist(token);
      }, 5 * 60 * 1000);
    }
    return cookies;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetUserUsecaseInitParams
  ): Promise<void> => {
    const { makeCookieHandler, makeJwtHandler } = optionalInitParams;
    this._cookieHandler = await makeCookieHandler;
    this._jwtHandler = await makeJwtHandler;
  };
}

export { GetUserUsecase, GetUserUsecaseResponse };
