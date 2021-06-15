// import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
// import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/usersDb';
// import { AbstractPostUsecase } from '../../abstractions/AbstractPostUsecase';
// import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
// import { ControllerData } from '../../abstractions/IUsecase';
// import { PostUserUsecaseResponse } from '../postUserUsecase';

// type PostUserLoginUsecaseResponse = PostUserUsecaseResponse;

// class PostUserLoginUsecase extends AbstractPostUsecase<PostUserLoginUsecaseResponse> {
//   private userDbService!: UserDbService;
//   protected _isValidRequest = (controllerData: ControllerData): boolean => {
//     return true;
//   };

//   private _loginUser = (props: {
//     body: any;
//     query: any;
//     accessOptions: AccessOptions;
//     userDbService: UserDbService;
//   }): JoinedUserDoc => {
//     const { body, query, accessOptions, userDbService } = props;
//     const { email, password } = body || {};
//     const user = this.userDbService.findOne({ searchQuery: { email }, accessOptions });
//     // find user with email *
//     // if user, check password match
//     // if match, check body
//     // if teacher app, make teacher*
//     // else, login user*
//     // if no user, check body... make teacher/user
//   };

//   protected _isCurrentAPIUserPermitted(props: {
//     params: any;
//     query?: any;
//     currentAPIUser: any;
//     endpointPath: string;
//   }): boolean {
//     return true;
//   }

//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<PostUserLoginUsecaseResponse> => {
//     const { params, body, accessOptions, query } = props;

//     // if no user with that email (new user), use postUserUsecase. If has email, decode pass and make token...
//     const savedDbUser = this._loginUser({
//       body,
//       query,
//       accessOptions,
//       userDbService: this.userDbService,
//     });
//     // make token and return token

//     return { user: savedDbUser, token: '', isLoginToken: true };
//   };

//   public init = async (props: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
//     const { makeUserDbService } = props;
//     this.userDbService = await makeUserDbService;
//     return this;
//   };
// }
