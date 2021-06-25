import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/user/userDbService';
import { RedirectPathBuilder } from '../../../utils/redirectPathBuilder/redirectPathBuilder';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import {
  CreateUserUsecase,
  CreateUserUsecaseResponse,
} from '../createUserUsecase/createUserUsecase';

type LoginUserUsecaseResponse = CreateUserUsecaseResponse;

enum SERVER_LOGIN_ENDPOINTS {
  BASE_LOGIN = '/auth/login',
  GOOGLE_LOGIN = '/auth/google',
}

class LoginUserUsecase extends AbstractCreateUsecase<LoginUserUsecaseResponse> {
  private _userDbService!: UserDbService;
  private _createUserUsecase!: CreateUserUsecase;
  private _oauth2Client!: any;
  private _google!: any;
  private _redirectPathBuilder!: RedirectPathBuilder;
  private _CLIENT_DASHBOARD_URI!: string;

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    return true;
  };

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    return true;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<LoginUserUsecaseResponse> => {
    const { body, accessOptions, query, endpointPath, controllerData } = props;
    if (endpointPath == SERVER_LOGIN_ENDPOINTS.BASE_LOGIN) {
      return await this._handleBaseLogin({
        body,
        query,
        accessOptions,
      });
    } else if (endpointPath == SERVER_LOGIN_ENDPOINTS.GOOGLE_LOGIN) {
      return await this._handleGoogleLogin({
        query,
        accessOptions,
        body,
        controllerData,
      });
    } else {
      throw new Error('Unsupported authentication endpoint.');
    }
  };

  private _handleBaseLogin = async (props: {
    body: any;
    query: any;
    accessOptions: AccessOptions;
  }): Promise<LoginUserUsecaseResponse> => {
    const { body, accessOptions } = props;
    const { email, password, isTeacherApp } = body || {};
    accessOptions.isOverridingSelectOptions = true;
    let savedDbUser = await this._userDbService.authenticateUser(
      {
        searchQuery: { email },
        accessOptions,
      },
      password
    );
    const handleNoSavedDbUser = () => {
      throw new Error('Username or password incorrect.');
    };
    savedDbUser = await this._loginUser({
      savedDbUser,
      accessOptions,
      isTeacherApp,
      handleNoSavedDbUser,
    });
    return this._createLoginUserUsecaseResponse(savedDbUser);
  };

  private _loginUser = async (props: {
    savedDbUser: JoinedUserDoc;
    accessOptions: AccessOptions;
    isTeacherApp: boolean;
    handleNoSavedDbUser: () => any;
  }): Promise<LoginUserUsecaseResponse> => {
    const { accessOptions, isTeacherApp, handleNoSavedDbUser } = props || {};
    let { savedDbUser } = props;
    if (savedDbUser) {
      const shouldCreateNewTeacher =
        !(savedDbUser.teacherAppPending || savedDbUser.role == 'teacher') && isTeacherApp;
      if (shouldCreateNewTeacher) {
        savedDbUser = await this._createUserUsecase.handleTeacherCreation(
          savedDbUser,
          accessOptions
        );
      }
      return this._createLoginUserUsecaseResponse(savedDbUser);
    } else {
      return await handleNoSavedDbUser();
    }
  };

  private _createLoginUserUsecaseResponse = (
    savedDbUser: JoinedUserDoc
  ): LoginUserUsecaseResponse => {
    return {
      user: savedDbUser,
      cookies: this._createUserUsecase.splitLoginCookies(savedDbUser),
      redirectURI: this._CLIENT_DASHBOARD_URI,
    };
  };

  private _handleGoogleLogin = async (props: {
    query: any;
    accessOptions: AccessOptions;
    body: any;
    controllerData: ControllerData;
  }): Promise<LoginUserUsecaseResponse> => {
    const { accessOptions, body, controllerData, query } = props;
    const { code, isTeacherApp, hostedBy } = this._parseGoogleQuery(query);
    const { tokens } = await this._oauth2Client.getToken(code);
    const { email, name, picture, locale } = await this._getGoogleUserData(tokens);

    let savedDbUser = await this._userDbService.findOne({ searchQuery: { email }, accessOptions });

    const handleNoSavedDbUser = async () => {
      body.name = name;
      body.email = email;
      body.profilePicture = picture;
      body.isTeacherApp = isTeacherApp;
      const userRes = await this._createUserUsecase.makeRequest(controllerData);
      if ('user' in userRes) {
        userRes.redirectURI = this._CLIENT_DASHBOARD_URI;
      }
      return userRes;
    };

    return await this._loginUser({
      savedDbUser,
      accessOptions,
      isTeacherApp,
      handleNoSavedDbUser,
    });
  };

  private _parseGoogleQuery = (query: { code: string; state: string }) => {
    const { code, state } = query || {};
    let parsedState, isTeacherApp, hostedBy;
    if (state) {
      const decodedClientState = Buffer.from(state, 'base64').toString();

      try {
        parsedState = JSON.parse(decodedClientState);
      } catch (err) {
        console.log(err);
      }
      ({ isTeacherApp, hostedBy } = parsedState);
    }

    return { code, isTeacherApp, hostedBy };
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

  public init = async (props: {
    makeUserDbService: Promise<UserDbService>;
    makeCreateUserUsecase: Promise<CreateUserUsecase>;
    oauth2Client: any;
    google: any;
    makeRedirectPathBuilder: RedirectPathBuilder;
  }): Promise<this> => {
    const {
      makeUserDbService,
      makeCreateUserUsecase,
      oauth2Client,
      google,
      makeRedirectPathBuilder,
    } = props;
    this._userDbService = await makeUserDbService;
    this._createUserUsecase = await makeCreateUserUsecase;
    this._oauth2Client = oauth2Client;
    this._google = google;
    this._redirectPathBuilder = makeRedirectPathBuilder;
    this._CLIENT_DASHBOARD_URI = this._redirectPathBuilder
      .host('client')
      .endpointPath('/dashboard')
      .build();
    return this;
  };
}

export { LoginUserUsecase, LoginUserUsecaseResponse };
