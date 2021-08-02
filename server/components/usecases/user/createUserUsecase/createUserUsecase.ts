import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { PackageDbService } from '../../../dataAccess/services/package/packageDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { TeacherBalanceDbService } from '../../../dataAccess/services/teacherBalance/teacherBalanceDbService';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { EmailHandler } from '../../utils/emailHandler/emailHandler';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { UserEntity } from '../../../entities/user/userEntity';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';
import { PackageTransactionEntity } from '../../../entities/packageTransaction/packageTransactionEntity';
import { TeacherBalanceEntity } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { TeacherEntity } from '../../../entities/teacher/teacherEntity';
import { PackageEntity } from '../../../entities/package/packageEntity';
import { JoinedUserDoc } from '../../../../models/User';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';

type OptionalCreateUserUsecaseInitParams = {
  makeUserEntity: Promise<UserEntity>;
  makePackageEntity: Promise<PackageEntity>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeTeacherBalanceEntity: Promise<TeacherBalanceEntity>;
  makeTeacherEntity: Promise<TeacherEntity>;
  makeUserDbService: Promise<UserDbService>;
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeTeacherBalanceDbService: Promise<TeacherBalanceDbService>;
  makeCacheDbService: Promise<CacheDbService>;
  signJwt: any;
  emailHandler: EmailHandler;
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
  private _userDbService!: UserDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _teacherBalanceDbService!: TeacherBalanceDbService;
  private _signJwt!: any;
  private _emailHandler!: EmailHandler;
  private _redirectUrlBuilder!: RedirectUrlBuilder;
  private _convertStringToObjectId!: any;
  private _cacheDbService!: CacheDbService;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateUserUsecaseResponse> => {
    const { body, dbServiceAccessOptions, query } = props;
    const { state } = query || {};
    const { isTeacherApp } = state || {};
    const userInstance = this._userEntity.build(body);
    let savedDbUser = await this._createDbUser({ userInstance, dbServiceAccessOptions });
    if (isTeacherApp) {
      savedDbUser = await this.handleTeacherCreation(savedDbUser, dbServiceAccessOptions);
    }
    if (process.env.NODE_ENV == 'production' && !savedDbUser.isEmailVerified) {
      this._sendVerificationEmail(userInstance);
      this._sendInternalEmail(userInstance, isTeacherApp);
    }
    const cookies = this.splitLoginCookies(savedDbUser);
    const redirectUrl = this._redirectUrlBuilder
      .host('client')
      .endpoint('/dashboard')
      .stringifyQueryStringObj(query)
      .build();
    const usecaseRes = {
      user: savedDbUser,
      cookies,
      redirectUrl,
    };
    return usecaseRes;
  };

  private _createDbUser = async (props: {
    userInstance: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { userInstance, dbServiceAccessOptions } = props;
    const savedDbUser = await this._userDbService.insert({
      modelToInsert: userInstance,
      dbServiceAccessOptions,
    });
    await this._createUserNode(savedDbUser);
    return savedDbUser;
  };

  private _createUserNode = async (savedDbUser: JoinedUserDoc): Promise<void> => {
    await this._cacheDbService.graphQuery(`CREATE (user: User { _id: "${savedDbUser._id}" })`);
  };

  public handleTeacherCreation = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<JoinedUserDoc> => {
    const joinedUserData = await this._createTeacherData({ savedDbUser, dbServiceAccessOptions });
    await this._createDbAdminPackageTransaction({ savedDbUser, dbServiceAccessOptions });
    await this._createGraphAdminTeacherEdge(savedDbUser);
    await this._createDbTeacherBalance({ savedDbUser, dbServiceAccessOptions });
    return joinedUserData;
  };

  private _createTeacherData = async (props: {
    savedDbUser: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { savedDbUser, dbServiceAccessOptions } = props;
    const teacherData = await this._teacherEntity.build({});
    const savedDbTeacher = await this._userDbService.findOneAndUpdate({
      searchQuery: { _id: savedDbUser._id },
      updateQuery: {
        teacherData,
      },
      dbServiceAccessOptions,
    });
    return savedDbTeacher;
  };

  private _createDbAdminPackageTransaction = async (props: {
    savedDbUser: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageTransactionDoc> => {
    const { savedDbUser, dbServiceAccessOptions } = props;
    const modelToInsert = await this._packageTransactionEntity.build({
      hostedById: this._convertStringToObjectId(process.env.MANABU_ADMIN_ID!),
      reservedById: savedDbUser._id,
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

  private _createGraphAdminTeacherEdge = async (savedDbUser: JoinedUserDoc): Promise<void> => {
    await this._cacheDbService.graphQuery(
      `MATCH (teacher: User {_id: "${savedDbUser._id}"}), (admin: User {_id:"${process.env
        .MANABU_ADMIN_ID!}"}) MERGE (admin)-[r: MANAGES {since: "${new Date()}"}]->(teacher)`
    );
  };

  private _createDbTeacherBalance = async (props: {
    savedDbUser: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherBalanceDoc> => {
    const { savedDbUser, dbServiceAccessOptions } = props;
    const modelToInsert = await this._teacherBalanceEntity.build({
      userId: savedDbUser._id,
    });
    const newTeacherBalance = await this._teacherBalanceDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newTeacherBalance;
  };

  private _sendVerificationEmail = (userInstance: any): void => {
    const host = 'https://manabu.sg';
    const { name, verificationToken } = userInstance;
    this._emailHandler.sendEmail(
      userInstance.email,
      'NOREPLY',
      'Manabu email verification',
      'verificationEmail',
      {
        name,
        host,
        verificationToken: verificationToken,
      }
    );
  };

  private _sendInternalEmail = (userInstance: any, isTeacherApp: boolean): void => {
    const userType = isTeacherApp ? 'teacher' : 'user';
    const { name, email } = userInstance;
    this._emailHandler.sendEmail(
      'manabulessons@gmail.com',
      'NOREPLY',
      `A new ${userType} signed up`,
      'internalNewSignUpEmail',
      {
        name,
        email,
        userType,
      }
    );
  };

  public splitLoginCookies = (savedDbUser: JoinedUserDoc): CookieData[] => {
    const token = this._signClientJwt(savedDbUser);
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

  private _signClientJwt = (savedDbUser: any): string => {
    const token = this._signJwt(
      {
        ...savedDbUser,
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
      makeUserDbService,
      makePackageTransactionDbService,
      makeTeacherBalanceDbService,
      makeCacheDbService,
      signJwt,
      emailHandler,
      makeRedirectUrlBuilder,
      convertStringToObjectId,
    } = optionalInitParams;
    this._userEntity = await makeUserEntity;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._teacherBalanceEntity = await makeTeacherBalanceEntity;
    this._teacherEntity = await makeTeacherEntity;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._teacherBalanceDbService = await makeTeacherBalanceDbService;
    this._cacheDbService = await makeCacheDbService;
    this._signJwt = signJwt;
    this._emailHandler = emailHandler;
    this._redirectUrlBuilder = makeRedirectUrlBuilder;
    this._convertStringToObjectId = convertStringToObjectId;
  };
}

export { CreateUserUsecase, CreateUserUsecaseResponse, CookieData };
