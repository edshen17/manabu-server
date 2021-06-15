import { makeCreateUserUsecase } from '..';
import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/usersDb';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import { CreateUserUsecase, CreateUserUsecaseResponse } from '../createUserUsecase';

type LoginUserUsecaseResponse = CreateUserUsecaseResponse;

class LoginUserUsecase extends AbstractCreateUsecase<CreateUserUsecaseResponse> {
  private userDbService!: UserDbService;
  private createUserUsecase!: CreateUserUsecase;
  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    return true;
  };

  private _loginUser = async (props: {
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
    if (user) {
      if (isTeacherApp) {
        user = await this.createUserUsecase.handleTeacherCreation(user, accessOptions);
      }
      return user;
    } else {
      throw new Error('Username or password incorrect.');
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
    const { body, accessOptions, query } = props;

    const savedDbUser = await this._loginUser({
      body,
      query,
      accessOptions,
    });
    const token = this.createUserUsecase.jwtToClient(savedDbUser);

    return { user: savedDbUser, token, isLoginToken: true };
  };

  public init = async (props: {
    makeUserDbService: Promise<UserDbService>;
    makeCreateUserUsecase: Promise<CreateUserUsecase>;
  }): Promise<this> => {
    const { makeUserDbService } = props;
    this.userDbService = await makeUserDbService;
    this.createUserUsecase = await makeCreateUserUsecase;
    return this;
  };
}

export { LoginUserUsecase, LoginUserUsecaseResponse };
