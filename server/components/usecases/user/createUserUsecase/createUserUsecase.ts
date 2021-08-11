import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { PackageDbService } from '../../../dataAccess/services/package/packageDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { TeacherBalanceDbService } from '../../../dataAccess/services/teacherBalance/teacherBalanceDbService';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { UserEntity, UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';
import { PackageTransactionEntity } from '../../../entities/packageTransaction/packageTransactionEntity';
import { TeacherBalanceEntity } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { TeacherEntity } from '../../../entities/teacher/teacherEntity';
import { PackageEntity } from '../../../entities/package/packageEntity';
import { JoinedUserDoc } from '../../../../models/User';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { EmailHandler } from '../../utils/emailHandler/emailHandler';

type OptionalCreateUserUsecaseInitParams = {
  makeUserEntity: Promise<UserEntity>;
  makePackageEntity: Promise<PackageEntity>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeTeacherBalanceEntity: Promise<TeacherBalanceEntity>;
  makeTeacherEntity: Promise<TeacherEntity>;
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeTeacherBalanceDbService: Promise<TeacherBalanceDbService>;
  makeCacheDbService: Promise<CacheDbService>;
  signJwt: any;
  makeEmailHandler: Promise<EmailHandler>;
  makeRedirectUrlBuilder: RedirectUrlBuilder;
  convertStringToObjectId: any;
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
  CreateUserUsecaseResponse
> {
  private _userEntity!: UserEntity;
  private _packageTransactionEntity!: PackageTransactionEntity;
  private _teacherBalanceEntity!: TeacherBalanceEntity;
  private _teacherEntity!: TeacherEntity;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _teacherBalanceDbService!: TeacherBalanceDbService;
  private _signJwt!: any;
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
      // this._sendInternalEmail({ userEntity, isTeacherApp });
    }
    this._sendVerificationEmail(userEntity);
    const cookies = this.splitLoginCookies(user);
    const redirectUrl = this._redirectUrlBuilder
      .host('client')
      .endpoint('/dashboard')
      .stringifyQueryStringObj(query)
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
    await this._createUserNode(user);
    return user;
  };

  private _createUserNode = async (user: JoinedUserDoc): Promise<void> => {
    await this._cacheDbService.graphQuery(`CREATE (user: User { _id: "${user._id}" })`);
  };

  public handleTeacherCreation = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { user, dbServiceAccessOptions } = props;
    const joinedUserData = await this._createTeacherData({ user, dbServiceAccessOptions });
    await this._createDbAdminPackageTransaction({ user, dbServiceAccessOptions });
    await this._createGraphAdminTeacherEdge(user);
    await this._createDbTeacherBalance({ user, dbServiceAccessOptions });
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
      hostedById: this._convertStringToObjectId(process.env.MANABU_ADMIN_ID!),
      reservedById: user._id,
      packageId: this._convertStringToObjectId(process.env.MANABU_ADMIN_PKG_ID!),
      lessonDuration: 60,
      remainingAppointments: 1,
      priceData: {
        currency: 'SGD',
        subTotal: 0,
        total: 0,
      },
      lessonLanguage: 'ja',
      isSubscription: false,
      paymentData: {},
    });
    const newPackageTransaction = await this._packageTransactionDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newPackageTransaction;
  };

  private _createGraphAdminTeacherEdge = async (user: JoinedUserDoc): Promise<void> => {
    await this._cacheDbService.graphQuery(
      `MATCH (teacher: User {_id: "${user._id}"}), (admin: User {_id:"${process.env
        .MANABU_ADMIN_ID!}"}) MERGE (admin)-[r: MANAGES {since: "${new Date()}"}]->(teacher)`
    );
  };

  private _createDbTeacherBalance = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherBalanceDoc> => {
    const { user, dbServiceAccessOptions } = props;
    const modelToInsert = await this._teacherBalanceEntity.build({
      userId: user._id,
    });
    const newTeacherBalance = await this._teacherBalanceDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newTeacherBalance;
  };

  private _sendVerificationEmail = (userEntity: any): void => {
    const host = 'https://manabu.sg';
    const { name, verificationToken } = userEntity;
    this._emailHandler.sendEmail({
      recipientEmails: userEntity.email,
      sendFrom: 'NOREPLY',
      subjectLine: 'Manabu email verification',
      htmlFileName: 'verificationEmail',
      templateStrings: {
        name,
        host,
        verificationToken,
      },
    });
  };

  private _sendInternalEmail = (props: { userEntity: any; isTeacherApp: boolean }): void => {
    const { userEntity, isTeacherApp } = props;
    const userType = isTeacherApp ? 'teacher' : 'user';
    const { name, email } = userEntity;
    this._emailHandler.sendEmail({
      recipientEmails: 'manabulessons@gmail.com',
      sendFrom: 'NOREPLY',
      subjectLine: `A new ${userType} signed up`,
      htmlFileName: 'internalNewSignUpEmail',
      templateStrings: {
        name,
        email,
        userType,
      },
    });
  };

  public splitLoginCookies = (user: JoinedUserDoc): CookieData[] => {
    const token = this._signClientJwt(user);
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

  private _signClientJwt = (user: any): string => {
    const token = this._signJwt(
      {
        ...user,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 24 * 60 * 60 * 7,
      }
    );
    return token;
  };

  private _setCookieOptions = (): CookieData['options'] => {
    const cookieOptions = {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    };

    if (process.env.NODE_ENV != 'production') {
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
      makeTeacherBalanceEntity,
      makeTeacherEntity,
      makePackageTransactionDbService,
      makeTeacherBalanceDbService,
      makeCacheDbService,
      signJwt,
      makeEmailHandler,
      makeRedirectUrlBuilder,
      convertStringToObjectId,
    } = optionalInitParams;
    this._userEntity = await makeUserEntity;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._teacherBalanceEntity = await makeTeacherBalanceEntity;
    this._teacherEntity = await makeTeacherEntity;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._teacherBalanceDbService = await makeTeacherBalanceDbService;
    this._cacheDbService = await makeCacheDbService;
    this._signJwt = signJwt;
    this._emailHandler = await makeEmailHandler;
    this._redirectUrlBuilder = makeRedirectUrlBuilder;
    this._convertStringToObjectId = convertStringToObjectId;
  };
}

export { CreateUserUsecase, CreateUserUsecaseResponse, CookieData };
