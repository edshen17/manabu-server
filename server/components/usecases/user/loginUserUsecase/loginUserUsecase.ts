import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { RedirectPathBuilder } from '../../utils/redirectPathBuilder/redirectPathBuilder';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import {
  CreateUserUsecase,
  CreateUserUsecaseResponse,
} from '../createUserUsecase/createUserUsecase';
import { JoinedUserDoc } from '../../../../models/User';

type LoginUserUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeCreateUserUsecase: Promise<CreateUserUsecase>;
  oauth2Client: any;
  google: any;
  makeRedirectPathBuilder: RedirectPathBuilder;
  cloneDeep: any;
};
type LoginUserUsecaseResponse = CreateUserUsecaseResponse;

enum SERVER_LOGIN_ENDPOINTS {
  BASE_LOGIN = '/auth/login',
  GOOGLE_LOGIN = '/auth/google',
}

class LoginUserUsecase extends AbstractCreateUsecase<
  LoginUserUsecaseInitParams,
  LoginUserUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _createUserUsecase!: CreateUserUsecase;
  private _oauth2Client!: any;
  private _google!: any;
  private _redirectPathBuilder!: RedirectPathBuilder;
  private _CLIENT_DASHBOARD_URI!: string;
  private _cloneDeep!: any;

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    return true;
  };

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    // query string handler here?
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
    let savedDbUser = await this._userDbService.authenticateUser(
      {
        searchQuery: { email },
        dbServiceAccessOptions: dbServiceAccessOptionsCopy,
      },
      password
    );
    const handleNoSavedDbUser = () => {
      throw new Error('Username or password incorrect.');
    };
    const baseLoginResponse = await this._loginUser({
      savedDbUser,
      dbServiceAccessOptions,
      query,
      handleNoSavedDbUser,
    });
    return baseLoginResponse;
  };

  private _loginUser = async (props: {
    savedDbUser: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    query: any;
    handleNoSavedDbUser: () => any;
  }): Promise<LoginUserUsecaseResponse> => {
    const { dbServiceAccessOptions, query, handleNoSavedDbUser } = props || {};
    let { savedDbUser } = props;
    const { state } = query || {};
    const { isTeacherApp } = state || {};
    if (savedDbUser) {
      const isTeacher = savedDbUser.teacherAppPending || savedDbUser.role == 'teacher';
      const shouldCreateNewTeacher = !isTeacher && isTeacherApp;
      if (shouldCreateNewTeacher) {
        savedDbUser = await this._createUserUsecase.handleTeacherCreation(
          savedDbUser,
          dbServiceAccessOptions
        );
      }
      const loginUserRes = this._createLoginResponse(savedDbUser);
      return loginUserRes;
    } else {
      const noSavedDbUserRes = await handleNoSavedDbUser();
      return noSavedDbUserRes;
    }
  };

  private _createLoginResponse = (savedDbUser: JoinedUserDoc): LoginUserUsecaseResponse => {
    return {
      user: savedDbUser,
      cookies: this._createUserUsecase.splitLoginCookies(savedDbUser),
      redirectPath: this._CLIENT_DASHBOARD_URI,
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
    const { email, name, picture, locale } = await this._getGoogleUserData(tokens);

    let savedDbUser = await this._userDbService.findOne({
      searchQuery: { email },
      dbServiceAccessOptions,
    });

    const handleNoSavedDbUser = async () => {
      // mutate controller data body
      body.name = name;
      body.email = email;
      body.profilePicture = picture;
      const userRes = await this._createUserUsecase.makeRequest(controllerData);
      if ('user' in userRes) {
        userRes.redirectPath = this._CLIENT_DASHBOARD_URI;
      }
      return userRes;
    };

    const googleLoginRes = await this._loginUser({
      savedDbUser,
      dbServiceAccessOptions,
      query,
      handleNoSavedDbUser,
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

  public init = async (initParams: LoginUserUsecaseInitParams): Promise<this> => {
    const {
      makeUserDbService,
      makeCreateUserUsecase,
      oauth2Client,
      google,
      makeRedirectPathBuilder,
      cloneDeep,
    } = initParams;
    this._userDbService = await makeUserDbService;
    this._createUserUsecase = await makeCreateUserUsecase;
    this._oauth2Client = oauth2Client;
    this._google = google;
    this._redirectPathBuilder = makeRedirectPathBuilder;
    this._CLIENT_DASHBOARD_URI = this._redirectPathBuilder
      .host('client')
      .endpointPath('/dashboard')
      .build();
    this._cloneDeep = cloneDeep;
    return this;
  };
}

export { LoginUserUsecase, LoginUserUsecaseResponse };
