import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/usersDb/usersDb';
import { RedirectPathBuilder } from '../../../utils/redirectPathBuilder/redirectPathBuilder';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import { CreateUserUsecase, CreateUserUsecaseResponse } from '../createUserUsecase';

type LoginUserUsecaseResponse = CreateUserUsecaseResponse;

enum SERVER_LOGIN_ENDPOINTS {
  BASE_LOGIN = '/auth/login',
  GOOGLE_LOGIN = '/auth/google',
}

class LoginUserUsecase extends AbstractCreateUsecase<LoginUserUsecaseResponse> {
  private userDbService!: UserDbService;
  private createUserUsecase!: CreateUserUsecase;
  private oauth2Client!: any;
  private google!: any;
  private redirectPathBuilder!: RedirectPathBuilder;
  private CLIENT_DASHBOARD_URI!: string;

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
    let savedDbUser = await this.userDbService.authenticateUser(
      {
        searchQuery: { email },
        accessOptions,
      },
      password
    );
    const handleNoSavedDbUser = () => {
      throw new Error('Username or password incorrect.');
    };
    savedDbUser = await this._handleUserToTeacher({
      savedDbUser,
      accessOptions,
      isTeacherApp,
      handleNoSavedDbUser,
    });
    return this._createLoginUserUsecaseResponse(savedDbUser, false);
  };

  private _handleGoogleLogin = async (props: {
    query: any;
    accessOptions: AccessOptions;
    body: any;
    controllerData: ControllerData;
  }): Promise<LoginUserUsecaseResponse> => {
    const { accessOptions, body, controllerData, query } = props;
    const { code, isTeacherApp, hostedBy } = this._parseGoogleQuery(query);
    const { tokens } = await this.oauth2Client.getToken(code);
    const { email, name, picture, locale } = await this._getGoogleUserData(tokens);

    let savedDbUser = await this.userDbService.findOne({ searchQuery: { email }, accessOptions });

    const handleNoSavedDbUser = async () => {
      body.name = name;
      body.email = email;
      body.profilePicture = picture;
      body.isTeacherApp = isTeacherApp;
      const userRes = await this.createUserUsecase.makeRequest(controllerData);
      if ('user' in userRes) {
        userRes.redirectURI = this.CLIENT_DASHBOARD_URI;
      }
      return userRes;
    };

    return await this._handleUserToTeacher({
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
    this.oauth2Client.setCredentials({
      access_token: tokens.access_token,
    });
    const oauth2 = this.google.oauth2({
      auth: this.oauth2Client,
      version: 'v2',
    });
    const googleRes = await oauth2.userinfo.get();
    return googleRes.data;
  };

  private _handleUserToTeacher = async (props: {
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
        savedDbUser = await this.createUserUsecase.handleTeacherCreation(
          savedDbUser,
          accessOptions
        );
      }
      return this._createLoginUserUsecaseResponse(savedDbUser, false);
    } else {
      return await handleNoSavedDbUser();
    }
  };

  private _createLoginUserUsecaseResponse = (
    savedDbUser: JoinedUserDoc,
    hasRedirectURI: boolean
  ): LoginUserUsecaseResponse => {
    const redirectURI = hasRedirectURI ? this.CLIENT_DASHBOARD_URI : undefined;
    return {
      user: savedDbUser,
      cookies: this.createUserUsecase.splitLoginCookies(savedDbUser),
      redirectURI,
    };
  };

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    return true;
  };

  protected _isCurrentAPIUserPermitted(props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean {
    return true;
  }

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
    this.userDbService = await makeUserDbService;
    this.createUserUsecase = await makeCreateUserUsecase;
    this.oauth2Client = oauth2Client;
    this.google = google;
    this.redirectPathBuilder = makeRedirectPathBuilder;
    this.CLIENT_DASHBOARD_URI = this.redirectPathBuilder
      .host('client')
      .endpointPath('/dashboard')
      .build();
    return this;
  };
}

export { LoginUserUsecase, LoginUserUsecaseResponse };
