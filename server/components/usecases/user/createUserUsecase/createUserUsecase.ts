import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
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
import { RedirectPathBuilder } from '../../utils/redirectPathBuilder/redirectPathBuilder';
import { PackageTransactionEntity } from '../../../entities/packageTransaction/packageTransactionEntity';
import { TeacherBalanceEntity } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { TeacherEntity, TeacherEntityBuildResponse } from '../../../entities/teacher/teacherEntity';
import { PackageEntity } from '../../../entities/package/packageEntity';
import { MinuteBankEntity } from '../../../entities/minuteBank/minuteBankEntity';
import { JoinedUserDoc } from '../../../../models/User';

type OptionalCreateUserUsecaseInitParams = {
  makeUserEntity: Promise<UserEntity>;
  makePackageEntity: Promise<PackageEntity>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeTeacherBalanceEntity: Promise<TeacherBalanceEntity>;
  makeMinuteBankEntity: Promise<MinuteBankEntity>;
  makeTeacherEntity: Promise<TeacherEntity>;
  makeUserDbService: Promise<UserDbService>;
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
  makeTeacherBalanceDbService: Promise<TeacherBalanceDbService>;
  signJwt: any;
  emailHandler: EmailHandler;
  makeRedirectPathBuilder: RedirectPathBuilder;
  cloneDeep: any;
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
  redirectPath: string;
};

class CreateUserUsecase extends AbstractCreateUsecase<
  OptionalCreateUserUsecaseInitParams,
  CreateUserUsecaseResponse
> {
  private _userEntity!: UserEntity;
  private _packageTransactionEntity!: PackageTransactionEntity;
  private _teacherBalanceEntity!: TeacherBalanceEntity;
  private _teacherEntity!: TeacherEntity;
  private _minuteBankEntity!: MinuteBankEntity;
  private _userDbService!: UserDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _minuteBankDbService!: MinuteBankDbService;
  private _teacherBalanceDbService!: TeacherBalanceDbService;
  private _signJwt!: any;
  private _emailHandler!: EmailHandler;
  private _redirectPathBuilder!: RedirectPathBuilder;
  private _convertStringToObjectId!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateUserUsecaseResponse> => {
    const { body, dbServiceAccessOptions, query } = props;
    const { state } = query || {};
    const { isTeacherApp } = state || {};
    const userInstance = this._userEntity.build(body);
    let savedDbUser = await this._createDbUser(userInstance, dbServiceAccessOptions);
    if (isTeacherApp) {
      savedDbUser = await this.handleTeacherCreation(savedDbUser, dbServiceAccessOptions);
    }
    if (process.env.NODE_ENV == 'production' && !savedDbUser.isEmailVerified) {
      this._sendVerificationEmail(userInstance);
      this._sendInternalEmail(userInstance, isTeacherApp);
    }
    const cookies = this.splitLoginCookies(savedDbUser);
    const redirectPath = this._redirectPathBuilder
      .host('client')
      .endpointPath('/dashboard')
      .stringifyQueryStringObj(query)
      .build();
    const usecaseRes = {
      user: savedDbUser,
      cookies,
      redirectPath,
    };
    return usecaseRes;
  };

  private _createDbUser = async (
    userInstance: any,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<JoinedUserDoc> => {
    const savedDbUser = await this._userDbService.insert({
      modelToInsert: userInstance,
      dbServiceAccessOptions,
    });
    return savedDbUser;
  };

  public handleTeacherCreation = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<JoinedUserDoc> => {
    const joinedUserData = await this._addTeacherData({ savedDbUser, dbServiceAccessOptions });
    await this._createDbAdminPackageTransaction(savedDbUser, dbServiceAccessOptions);
    await this._createDbAdminMinuteBank(savedDbUser, dbServiceAccessOptions);
    await this._createDbTeacherBalance(savedDbUser, dbServiceAccessOptions);
    return joinedUserData;
  };

  private _addTeacherData = async (props: {
    savedDbUser: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { savedDbUser, dbServiceAccessOptions } = props;
    const teacherData = this._teacherEntity.build({});
    const savedDbTeacher = await this._userDbService.findOneAndUpdate({
      searchQuery: { _id: savedDbUser._id },
      updateQuery: {
        teacherData,
      },
      dbServiceAccessOptions,
    });
    return savedDbTeacher;
  };

  private _createDbAdminPackageTransaction = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<PackageTransactionDoc> => {
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

  private _createDbAdminMinuteBank = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<MinuteBankDoc> => {
    const modelToInsert = await this._minuteBankEntity.build({
      hostedById: this._convertStringToObjectId(process.env.MANABU_ADMIN_ID!),
      reservedById: savedDbUser._id,
    });
    const newMinuteBank = await this._minuteBankDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newMinuteBank;
  };

  private _createDbTeacherBalance = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<TeacherBalanceDoc> => {
    const modelToInsert = await this._teacherBalanceEntity.build({
      userId: savedDbUser._id,
    });
    const newTeacherBalance = this._teacherBalanceDbService.insert({
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
    const { role, name } = savedDbUser;
    const token = this._signJwt(
      {
        _id: savedDbUser._id,
        role,
        name,
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
      makeMinuteBankEntity,
      makePackageTransactionDbService,
      makeMinuteBankDbService,
      makeTeacherBalanceDbService,
      signJwt,
      emailHandler,
      makeRedirectPathBuilder,
      convertStringToObjectId,
    } = optionalInitParams;
    this._userEntity = await makeUserEntity;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._teacherBalanceEntity = await makeTeacherBalanceEntity;
    this._teacherEntity = await makeTeacherEntity;
    this._minuteBankEntity = await makeMinuteBankEntity;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._minuteBankDbService = await makeMinuteBankDbService;
    this._teacherBalanceDbService = await makeTeacherBalanceDbService;
    this._signJwt = signJwt;
    this._emailHandler = emailHandler;
    this._redirectPathBuilder = makeRedirectPathBuilder;
    this._convertStringToObjectId = convertStringToObjectId;
  };
}

export { CreateUserUsecase, CreateUserUsecaseResponse, CookieData };
