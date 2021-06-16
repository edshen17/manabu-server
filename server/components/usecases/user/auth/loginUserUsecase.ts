import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/usersDb';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import { CreateUserUsecase, CreateUserUsecaseResponse } from '../createUserUsecase';

type LoginUserUsecaseResponse = CreateUserUsecaseResponse;

class LoginUserUsecase extends AbstractCreateUsecase<LoginUserUsecaseResponse> {
  private userDbService!: UserDbService;
  private createUserUsecase!: CreateUserUsecase;
  private oauth2Client!: any;
  private google!: any;
  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    return true;
  };

  private _handleUserToTeacher = async (props: {
    user: JoinedUserDoc;
    accessOptions: AccessOptions;
    isTeacherApp: boolean;
    callbackTemplate: any;
  }): Promise<JoinedUserDoc> => {
    const { accessOptions, isTeacherApp, callbackTemplate } = props || {};
    let { user } = props;
    if (user) {
      if (!(user.teacherAppPending || user.role == 'teacher') && isTeacherApp) {
        user = await this.createUserUsecase.handleTeacherCreation(user, accessOptions);
      }
      return user;
    } else {
      return await callbackTemplate();
    }
  };

  private _handleBaseLogin = async (props: {
    body: any;
    query: any;
    accessOptions: AccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { body, accessOptions } = props;
    const { email, password, isTeacherApp } = body || {};
    const accessOptionsCopy: AccessOptions = JSON.parse(JSON.stringify(accessOptions));
    accessOptionsCopy.isOverridingSelectOptions = true;
    let user = await this.userDbService.authenticateUser(
      {
        searchQuery: { email },
        accessOptions: accessOptionsCopy,
      },
      password
    );
    const callbackTemplate = () => {
      throw new Error('Username or password incorrect.');
    };
    user = await this._handleUserToTeacher({ user, accessOptions, isTeacherApp, callbackTemplate });
    return user;
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

  private _handleGoogleLogin = async (props: { query: any; accessOptions: AccessOptions }) => {
    const { query, accessOptions } = props;
    const { code, isTeacherApp, hostedBy } = this._parseGoogleQuery(query);
    const { tokens } = await this.oauth2Client.getToken(code);
    const { email, name, picture, locale } = await this._getGoogleUserData(tokens);
    let user = await this.userDbService.findOne({ searchQuery: { email }, accessOptions });
    if (user) {
      if (isTeacherApp) {
        user = await this.createUserUsecase.handleTeacherCreation(user, accessOptions);
      }
      return user;
    } else {
      // user = await this.createUserUsecase.makeRequest();
    }
  };

  protected _isCurrentAPIUserPermitted(props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean {
    return true;
  }

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<LoginUserUsecaseResponse> => {
    const { body, accessOptions, query, endpointPath } = props;
    let savedDbUser: any;
    if (endpointPath == '/auth/login') {
      savedDbUser = await this._handleBaseLogin({
        body,
        query,
        accessOptions,
      });
    } else if (endpointPath == '/auth/google') {
      savedDbUser = await this._handleGoogleLogin({ query, accessOptions });
    } else {
      throw new Error('Unsupported authentication endpoint.');
    }
    const token = this.createUserUsecase.jwtToClient(savedDbUser);
    return { user: savedDbUser, token, isLoginToken: true };
  };

  public init = async (props: {
    makeUserDbService: Promise<UserDbService>;
    makeCreateUserUsecase: Promise<CreateUserUsecase>;
    oauth2Client: any;
    google: any;
  }): Promise<this> => {
    const { makeUserDbService, makeCreateUserUsecase, oauth2Client, google } = props;
    this.userDbService = await makeUserDbService;
    this.createUserUsecase = await makeCreateUserUsecase;
    this.oauth2Client = oauth2Client;
    this.google = google;
    return this;
  };
}

export { LoginUserUsecase, LoginUserUsecaseResponse };
