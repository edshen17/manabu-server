import {
  IS_PRODUCTION,
  MANABU_ADMIN_EMAIL,
  MANABU_ADMIN_ID,
  MANABU_ADMIN_PKG_ID,
} from '../../../../constants';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
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
import {
  EmailHandler,
  EMAIL_HANDLER_SENDER_ADDRESS,
  EMAIL_HANDLER_TEMPLATE,
} from '../../utils/emailHandler/emailHandler';
import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';

type OptionalCreateUserUsecaseInitParams = {
  makeUserEntity: Promise<UserEntity>;
  makePackageEntity: Promise<PackageEntity>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeTeacherEntity: Promise<TeacherEntity>;
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeCacheDbService: Promise<CacheDbService>;
  makeJwtHandler: Promise<JwtHandler>;
  makeEmailHandler: Promise<EmailHandler>;
  makeRedirectUrlBuilder: RedirectUrlBuilder;
  convertStringToObjectId: ConvertStringToObjectId;
};

type CookieData = {
  name: string;
  value: string;
  options: {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
  };
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
  private _jwtHandler!: JwtHandler;
  private _emailHandler!: EmailHandler;
  private _redirectUrlBuilder!: RedirectUrlBuilder;
  private _convertStringToObjectId!: any;
  private _cacheDbService!: CacheDbService;

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
    const cookies = this.splitLoginCookies(user);
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
    await this._cacheDbService.createUserNode(user);
    return user;
  };

  public handleTeacherCreation = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { user, dbServiceAccessOptions } = props;
    const joinedUserData = await this._createTeacherData({ user, dbServiceAccessOptions });
    await this._createDbAdminPackageTransaction({ user, dbServiceAccessOptions });
    await this._createGraphAdminTeacherEdge(user);
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

  private _createGraphAdminTeacherEdge = async (user: JoinedUserDoc): Promise<void> => {
    await this._cacheDbService.graphQuery(
      `MATCH (teacher: User {_id: "${
        user._id
      }"}), (admin: User {_id:"${MANABU_ADMIN_ID}"}) MERGE (admin)-[r: MANAGES {since: "${new Date().toISOString()}"}]->(teacher)`
    );
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

  public splitLoginCookies = (user: JoinedUserDoc): CookieData[] => {
    const { _id, role } = user;
    const toTokenObj = {
      _id,
      role,
      teacherData: {
        _id: user.teacherData?._id,
      },
    };
    const token = this._jwtHandler.sign({ toTokenObj, expiresIn: '7d' });
    const tokenArr: string[] = token.split('.');
    const options = this._setCookieOptions();
    const hpCookie = {
      name: 'hp',
      value: `${tokenArr[0]}.${tokenArr[1]}`,
      options,
    };
    const sigCookie = {
      name: 'sig',
      value: `.${tokenArr[2]}`,
      options,
    };
    const loginCookies = [hpCookie, sigCookie];
    return loginCookies;
  };

  private _setCookieOptions = (): CookieData['options'] => {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const cookieOptions = {
      maxAge: ONE_WEEK_MS,
      httpOnly: true,
      secure: true,
    };
    if (!IS_PRODUCTION) {
      cookieOptions.httpOnly = false;
      cookieOptions.secure = false;
    }
    return cookieOptions;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateUserUsecaseInitParams
  ): Promise<void> => {
    const {
      makeUserEntity,
      makePackageTransactionEntity,
      makeTeacherEntity,
      makePackageTransactionDbService,
      makeCacheDbService,
      makeJwtHandler,
      makeEmailHandler,
      makeRedirectUrlBuilder,
      convertStringToObjectId,
    } = optionalInitParams;
    this._userEntity = await makeUserEntity;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._teacherEntity = await makeTeacherEntity;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._cacheDbService = await makeCacheDbService;
    this._jwtHandler = await makeJwtHandler;
    this._emailHandler = await makeEmailHandler;
    this._redirectUrlBuilder = makeRedirectUrlBuilder;
    this._convertStringToObjectId = convertStringToObjectId;
  };
}

export { CreateUserUsecase, CreateUserUsecaseResponse, CookieData };
