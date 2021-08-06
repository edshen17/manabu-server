import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import {
  CreateUserUsecase,
  CreateUserUsecaseResponse,
} from '../createUserUsecase/createUserUsecase';
import { JoinedUserDoc } from '../../../../models/User';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';

type OptionalLoginUserUsecaseInitParams = {
  makeCreateUserUsecase: Promise<CreateUserUsecase>;
  oauth2Client: any;
  google: any;
  makeRedirectUrlBuilder: RedirectUrlBuilder;
};
type LoginUserUsecaseResponse = CreateUserUsecaseResponse;

enum SERVER_LOGIN_ENDPOINTS {
  BASE_LOGIN = '/base/login',
  GOOGLE_LOGIN = '/google/login',
}

class LoginUserUsecase extends AbstractCreateUsecase<
  OptionalLoginUserUsecaseInitParams,
  LoginUserUsecaseResponse
> {
  private _createUserUsecase!: CreateUserUsecase;
  private _oauth2Client!: any;
  private _google!: any;
  private _redirectUrlBuilder!: RedirectUrlBuilder;
  private _CLIENT_DASHBOARD_URL!: string;

  protected _isSelf = async (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): Promise<boolean> => {
    return true;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<LoginUserUsecaseResponse> => {
    const { body, dbServiceAccessOptions, query, endpointPath, controllerData } = props;
    const isBaseLogin = endpointPath == SERVER_LOGIN_ENDPOINTS.BASE_LOGIN;
    const isGoogleLogin = endpointPath == SERVER_LOGIN_ENDPOINTS.GOOGLE_LOGIN;
    if (isBaseLogin) {
      const baseLoginRes = await this._handleBaseLogin({
        body,
        query,
        dbServiceAccessOptions,
        controllerData,
      });
      return baseLoginRes;
    } else if (isGoogleLogin) {
      const googleLoginRes = await this._handleGoogleLogin({
        body,
        query,
        dbServiceAccessOptions,
        controllerData,
      });
      return googleLoginRes;
    } else {
      throw new Error('Unsupported authentication endpoint.');
    }
  };

  private _handleBaseLogin = async (props: {
    body: any;
    query: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
    controllerData: ControllerData;
  }): Promise<LoginUserUsecaseResponse> => {
    const { body, dbServiceAccessOptions, query } = props;
    const { email, password } = body || {};
    const dbServiceAccessOptionsCopy = this._cloneDeep(dbServiceAccessOptions);
    dbServiceAccessOptionsCopy.isOverrideView = true;
    const dbService = <UserDbService>this._dbService;
    let user = await dbService.authenticateUser(
      {
        searchQuery: { email },
        dbServiceAccessOptions: dbServiceAccessOptionsCopy,
      },
      password
    );
    const handleNoDbUser = () => {
      throw new Error('Username or password incorrect.');
    };
    const baseLoginResponse = await this._loginUser({
      user,
      dbServiceAccessOptions,
      query,
      handleNoDbUser,
    });
    return baseLoginResponse;
  };

  private _loginUser = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    query: any;
    handleNoDbUser: () => any;
  }): Promise<LoginUserUsecaseResponse> => {
    const { dbServiceAccessOptions, query, handleNoDbUser } = props || {};
    let { user } = props;
    const { state } = query || {};
    const { isTeacherApp } = state || {};
    if (user) {
      const isTeacher = user.teacherData;
      const shouldCreateNewTeacher = !isTeacher && isTeacherApp;
      if (shouldCreateNewTeacher) {
        user = await this._createUserUsecase.handleTeacherCreation({
          user,
          dbServiceAccessOptions,
        });
      }
      const loginUserRes = this._createLoginResponse(user);
      return loginUserRes;
    } else {
      const noSavedDbUserRes = await handleNoDbUser();
      return noSavedDbUserRes;
    }
  };

  private _createLoginResponse = (user: JoinedUserDoc): LoginUserUsecaseResponse => {
    return {
      user: user,
      cookies: this._createUserUsecase.splitLoginCookies(user),
      redirectUrl: this._CLIENT_DASHBOARD_URL,
    };
  };

  private _handleGoogleLogin = async (props: {
    query: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
    body: any;
    controllerData: ControllerData;
  }): Promise<LoginUserUsecaseResponse> => {
    const { dbServiceAccessOptions, body, controllerData, query } = props;
    const { code } = query;
    const { tokens } = await this._oauth2Client.getToken(code);
    const { email, name, picture } = await this._getGoogleUserData(tokens);
    let user = await this._dbService.findOne({
      searchQuery: { email },
      dbServiceAccessOptions,
    });
    const handleNoDbUser = async () => {
      body.name = name;
      body.email = email;
      body.profilePicture = picture;
      const userRes = await this._createUserUsecase.makeRequest(controllerData);
      if ('user' in userRes) {
        userRes.redirectUrl = this._CLIENT_DASHBOARD_URL;
      }
      return userRes;
    };
    const googleLoginRes = await this._loginUser({
      user,
      dbServiceAccessOptions,
      query,
      handleNoDbUser,
    });
    return googleLoginRes;
  };

  private _getGoogleUserData = async (tokens: any): Promise<any> => {
    this._oauth2Client.setCredentials({
      access_token: tokens.access_token,
    });
    const oauth2 = this._google.oauth2({
      auth: this._oauth2Client,
      version: 'v2',
    });
    const googleRes = await oauth2.userinfo.get();
    return googleRes.data;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalLoginUserUsecaseInitParams
  ): Promise<void> => {
    const { makeCreateUserUsecase, oauth2Client, google, makeRedirectUrlBuilder } =
      optionalInitParams;
    this._createUserUsecase = await makeCreateUserUsecase;
    this._oauth2Client = oauth2Client;
    this._google = google;
    this._redirectUrlBuilder = makeRedirectUrlBuilder;
    this._CLIENT_DASHBOARD_URL = this._redirectUrlBuilder
      .host('client')
      .endpoint('/dashboard')
      .build();
  };
}

export { LoginUserUsecase, LoginUserUsecaseResponse };
