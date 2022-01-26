import { MANABU_ADMIN_EMAIL, MANABU_ADMIN_ID, MANABU_ADMIN_PKG_ID } from '../../../../constants';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { PackageDbService } from '../../../dataAccess/services/package/packageDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { PackageEntity } from '../../../entities/package/packageEntity';
import { PackageTransactionEntity } from '../../../entities/packageTransaction/packageTransactionEntity';
import { TeacherEntity } from '../../../entities/teacher/teacherEntity';
import { UserEntity, UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { ConvertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CookieData, CookieHandler } from '../../utils/cookieHandler/cookieHandler';
import {
  EmailHandler,
  EMAIL_HANDLER_SENDER_ADDRESS,
  EMAIL_HANDLER_TEMPLATE,
} from '../../utils/emailHandler/emailHandler';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';

type OptionalCreateUserUsecaseInitParams = {
  makeUserEntity: Promise<UserEntity>;
  makePackageEntity: Promise<PackageEntity>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeTeacherEntity: Promise<TeacherEntity>;
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeGraphDbService: Promise<GraphDbService>;
  makeCookieHandler: Promise<CookieHandler>;
  makeEmailHandler: Promise<EmailHandler>;
  makeRedirectUrlBuilder: RedirectUrlBuilder;
  convertStringToObjectId: ConvertStringToObjectId;
};

type CreateUserUsecaseResponse = {
  user: JoinedUserDoc;
  cookies: CookieData[];
  redirectUrl: string;
};

class CreateUserUsecase extends AbstractCreateUsecase<
  OptionalCreateUserUsecaseInitParams,
  CreateUserUsecaseResponse,
  UserDbServiceResponse
> {
  private _userEntity!: UserEntity;
  private _packageTransactionEntity!: PackageTransactionEntity;
  private _teacherEntity!: TeacherEntity;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _emailHandler!: EmailHandler;
  private _redirectUrlBuilder!: RedirectUrlBuilder;
  private _convertStringToObjectId!: any;
  private _graphDbService!: GraphDbService;
  private _cookieHandler!: CookieHandler;

  protected _isSelf = async (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): Promise<boolean> => {
    return true;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateUserUsecaseResponse> => {
    const { body, dbServiceAccessOptions, query } = props;
    const { state } = query || {};
    const { isTeacherApp } = state || {};
    const userEntity = await this._userEntity.build(body);
    let user = await this._createDbUser({ userEntity, dbServiceAccessOptions });
    if (isTeacherApp) {
      user = await this.handleTeacherCreation({ user, dbServiceAccessOptions });
    }
    if (!user.isEmailVerified) {
      this._sendVerificationEmail(userEntity);
      this._sendInternalEmail({ user, isTeacherApp });
    }
    const cookies = this._cookieHandler.splitLoginCookies(user);
    const redirectUrl = this._redirectUrlBuilder
      .host('client')
      .endpoint('/dashboard')
      .encodeQueryStringObj(query)
      .build();
    const usecaseRes = {
      user,
      cookies,
      redirectUrl,
    };
    return usecaseRes;
  };

  private _createDbUser = async (props: {
    userEntity: UserEntityBuildResponse;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { userEntity, dbServiceAccessOptions } = props;
    const user = await this._dbService.insert({
      modelToInsert: userEntity,
      dbServiceAccessOptions,
    });
    await this._graphDbService.createUserNode({ user, dbServiceAccessOptions });
    return user;
  };

  public handleTeacherCreation = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const [joinedUserData] = await Promise.all([
      this._createTeacherData(props),
      this._createDbAdminPackageTransaction(props),
      this._createGraphAdminTeacherEdge(props),
    ]);
    return joinedUserData;
  };

  private _createTeacherData = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { user, dbServiceAccessOptions } = props;
    const teacherData = await this._teacherEntity.build({});
    const savedDbTeacher = await this._dbService.findOneAndUpdate({
      searchQuery: { _id: user._id },
      updateQuery: {
        teacherData,
      },
      dbServiceAccessOptions,
    });
    return savedDbTeacher;
  };

  private _createDbAdminPackageTransaction = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageTransactionDoc> => {
    const { user, dbServiceAccessOptions } = props;
    const modelToInsert = await this._packageTransactionEntity.build({
      hostedById: this._convertStringToObjectId(MANABU_ADMIN_ID),
      reservedById: user._id,
      packageId: this._convertStringToObjectId(MANABU_ADMIN_PKG_ID),
      lessonDuration: 60,
      remainingAppointments: 1,
      lessonLanguage: 'ja',
      isSubscription: false,
    });
    const newPackageTransaction = await this._packageTransactionDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newPackageTransaction;
  };

  private _createGraphAdminTeacherEdge = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { user, dbServiceAccessOptions } = props;
    const query = `MATCH (teacher: User {_id: "${
      user._id
    }"}), (admin: User {_id:"${MANABU_ADMIN_ID}"}) MERGE (admin)-[r: manages {since: "${new Date().toISOString()}"}]->(teacher)`;

    await this._graphDbService.graphQuery({ query, dbServiceAccessOptions });
  };

  private _sendVerificationEmail = (userEntity: UserEntityBuildResponse): void => {
    const { name, verificationToken, settings, email } = userEntity;
    const { locale } = settings;
    this._emailHandler.send({
      to: email,
      from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
      templateName: EMAIL_HANDLER_TEMPLATE.EMAIL_VERIFICATION,
      data: {
        name,
        verificationToken,
      },
      locale,
    });
  };

  private _sendInternalEmail = (props: { user: JoinedUserDoc; isTeacherApp: boolean }): void => {
    const { user, isTeacherApp } = props;
    const userType = isTeacherApp ? 'teacher' : 'user';
    this._emailHandler.send({
      to: MANABU_ADMIN_EMAIL,
      from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
      templateName: EMAIL_HANDLER_TEMPLATE.INTERNAL_NEW_USER,
      data: {
        name: 'Admin',
        user,
        userType,
      },
    });
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateUserUsecaseInitParams
  ): Promise<void> => {
    const {
      makeUserEntity,
      makePackageTransactionEntity,
      makeTeacherEntity,
      makePackageTransactionDbService,
      makeGraphDbService,
      makeEmailHandler,
      makeRedirectUrlBuilder,
      makeCookieHandler,
      convertStringToObjectId,
    } = optionalInitParams;
    this._userEntity = await makeUserEntity;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._teacherEntity = await makeTeacherEntity;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._graphDbService = await makeGraphDbService;
    this._emailHandler = await makeEmailHandler;
    this._redirectUrlBuilder = makeRedirectUrlBuilder;
    this._convertStringToObjectId = convertStringToObjectId;
    this._cookieHandler = await makeCookieHandler;
  };
}

export { CreateUserUsecase, CreateUserUsecaseResponse, CookieData };
