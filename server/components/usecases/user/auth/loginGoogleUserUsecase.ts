// import { makeCreateUserUsecase } from '..';
// import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
// import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/usersDb';
// import { CreateUserUsecase } from '../createUserUsecase';
// import { LoginUserUsecase } from './loginUserUsecase';

// class LoginGoogleUserUsecase extends LoginUserUsecase {
//   private oauth2Client!: any;
//   private googleLib!: any;
//   protected _loginUser = async (props: {
//     body: any;
//     query: any;
//     accessOptions: AccessOptions;
//   }): Promise<JoinedUserDoc> => {
//     const { query, accessOptions } = props;
//     const { code, state } = query || {}
//     const googleTokenCode = code;
//     const decodedClientState = Buffer.from(state, 'base64').toString();
//     let parsedState;
//     try {
//       parsedState = JSON.parse(decodedClientState);
//     } catch (err) {
//       console.log(err);
//     }
//     const isTeacherApp = parsedState.isTeacherApp;
//     const hostedBy = parsedState.hostedBy;
//     const { tokens } = await this.oauth2Client.getToken(code);
//     this.oauth2Client.setCredentials({
//       access_token: tokens.access_token,
//     });

//     const oauth2 = google.oauth2({
//       auth: oauth2Client,
//       version: 'v2',
//     });

//     // const accessOptionsCopy: AccessOptions = JSON.parse(JSON.stringify(accessOptions));
//     // accessOptionsCopy.isOverridingSelectOptions = true;
//     // let user = await this.userDbService.authenticateUser(
//     //   {
//     //     searchQuery: { email },
//     //     accessOptions: accessOptionsCopy,
//     //   },
//     //   password
//     // );
//     // if (user) {
//     //   if (isTeacherApp) {
//     //     user = await this.createUserUsecase.handleTeacherCreation(user, accessOptions);
//     //   }
//     //   return user;
//     // } else {
//     //   throw new Error('Username or password incorrect.');
//     // }
//   };

//   public init = async (props: {
//     makeUserDbService: Promise<UserDbService>;
//     makeCreateUserUsecase: Promise<CreateUserUsecase>;
//     oauth2Client?: any;
//   }): Promise<this> => {
//     const { makeUserDbService } = props;
//     this.userDbService = await makeUserDbService;
//     this.createUserUsecase = await makeCreateUserUsecase;
//     this.oauth2Client = this.oauth2Client;
//     thi
//     return this;
//   };
// }

// export { LoginGoogleUserUsecase };
