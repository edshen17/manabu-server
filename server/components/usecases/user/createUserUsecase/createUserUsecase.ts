import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { PackageDoc } from '../../../../models/Package';
import { TeacherDoc } from '../../../../models/Teacher';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { PackageDbService } from '../../../dataAccess/services/package/packageDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { TeacherBalanceDbService } from '../../../dataAccess/services/teacherBalance/teacherBalanceDbService';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/user/userDbService';
import { makeMinuteBankEntity } from '../../../entities/minuteBank';
import { makePackageEntity } from '../../../entities/package';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makeTeacherBalanceEntity } from '../../../entities/teacherBalance';
import { makeTeacherEntity } from '../../../entities/teacher';
import { EmailHandler } from '../../utils/emailHandler/emailHandler';
import { ControllerData } from '../../abstractions/IUsecase';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { UserEntity } from '../../../entities/user/userEntity';

type CreateUserUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeUserEntity: UserEntity;
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
  makeTeacherBalanceDbService: Promise<TeacherBalanceDbService>;
  jwt: any;
  emailHandler: EmailHandler;
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

type CreateUserUsecaseResponse =
  | { user: JoinedUserDoc; cookies: CookieData[]; redirectURI?: string }
  | Error;

class CreateUserUsecase extends AbstractCreateUsecase<
  CreateUserUsecaseInitParams,
  CreateUserUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _userEntity!: UserEntity;
  private _teacherDbService!: TeacherDbService;
  private _packageDbService!: PackageDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _minuteBankDbService!: MinuteBankDbService;
  private _teacherBalanceDbService!: TeacherBalanceDbService;
  private _jwt!: any;
  private _emailHandler!: EmailHandler;

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { body } = controllerData.routeData;
    const { role, _id, dateRegistered } = body || {};
    return !role && !_id && !dateRegistered;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateUserUsecaseResponse> => {
    const { body, dbServiceAccessOptions } = props;
    const { isTeacherApp } = body || {};

    try {
      const userInstance = this._userEntity.build(body);
      let savedDbUser = await this._insertUser(userInstance, dbServiceAccessOptions);
      if (isTeacherApp) {
        savedDbUser = await this.handleTeacherCreation(savedDbUser, dbServiceAccessOptions);
      }

      if (process.env.NODE_ENV == 'production' && !savedDbUser.isEmailVerified) {
        this._sendVerificationEmail(userInstance);
        this._sendInternalEmail(userInstance, isTeacherApp);
      }
      const cookies = this.splitLoginCookies(savedDbUser);
      return {
        user: savedDbUser,
        cookies,
      };
    } catch (err) {
      throw err;
    }
  };

  private _insertUser = async (
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
    const joinedUserData = JSON.parse(JSON.stringify(savedDbUser));
    const teacherData: any = await this._insertTeacher(savedDbUser, dbServiceAccessOptions);
    const packages = await this._insertTeacherPackages(savedDbUser, dbServiceAccessOptions);

    await this._insertAdminPackageTransaction(savedDbUser, dbServiceAccessOptions);
    await this._insertAdminMinuteBank(savedDbUser, dbServiceAccessOptions);
    await this._insertTeacherBalance(savedDbUser, dbServiceAccessOptions);

    teacherData.packages = packages;
    joinedUserData.teacherData = teacherData;
    joinedUserData.teacherAppPending = true;
    return joinedUserData;
  };

  private _insertTeacher = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<TeacherDoc> => {
    const userId = savedDbUser._id;
    const modelToInsert = makeTeacherEntity.build({ userId });
    const savedDbTeacher = await this._teacherDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return savedDbTeacher;
  };

  private _insertTeacherPackages = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<PackageDoc[]> => {
    const packagesToInsert = await this._createDefaultTeacherPackages(savedDbUser);
    const modelToInsert = await Promise.all(packagesToInsert);

    const newPackages = await this._packageDbService.insertMany({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newPackages;
  };

  private _createDefaultTeacherPackages = async (savedDbUser: JoinedUserDoc) => {
    const defaultPackages = [
      { type: 'mainichi', lessonAmount: 22 },
      { type: 'moderate', lessonAmount: 12 },
      { type: 'light', lessonAmount: 5 },
    ];
    const packagesToInsert: any[] = [];
    defaultPackages.forEach(async (pkg) => {
      const packageProperties: { hostedBy: string; lessonAmount: number; packageType: string } = {
        hostedBy: savedDbUser._id,
        lessonAmount: pkg.lessonAmount,
        packageType: pkg.type,
      };
      const packageEntity = await makePackageEntity;

      packagesToInsert.push(
        new Promise(async (resolve, reject) => {
          const modelToInsert = await packageEntity.build(packageProperties);
          if (modelToInsert) {
            resolve(modelToInsert);
          } else {
            reject(modelToInsert);
          }
        })
      );
    });
    return packagesToInsert;
  };

  private _insertAdminPackageTransaction = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<PackageTransactionDoc> => {
    const packageTransactionEntity = await makePackageTransactionEntity;
    const modelToInsert = await packageTransactionEntity.build({
      hostedBy: process.env.MANABU_ADMIN_ID!,
      reservedBy: savedDbUser._id,
      packageId: process.env.MANABU_ADMIN_PKG_ID!,
      reservationLength: 60,
      remainingAppointments: 1,
      transactionDetails: {
        currency: 'SGD',
        subTotal: 0,
        total: 0,
      },
    });
    const newPackageTransaction = await this._packageTransactionDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newPackageTransaction;
  };

  private _insertAdminMinuteBank = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<MinuteBankDoc> => {
    const minuteBankEntity = await makeMinuteBankEntity;
    const modelToInsert = await minuteBankEntity.build({
      hostedBy: process.env.MANABU_ADMIN_ID!,
      reservedBy: savedDbUser._id,
    });
    const newMinuteBank = await this._minuteBankDbService.insert({
      modelToInsert,
      dbServiceAccessOptions,
    });
    return newMinuteBank;
  };

  private _insertTeacherBalance = async (
    savedDbUser: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<TeacherBalanceDoc> => {
    const teacherBalanceEntity = makeTeacherBalanceEntity;
    const modelToInsert = await teacherBalanceEntity.build({
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
    const token = this._jwtToClient(savedDbUser);
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

  private _jwtToClient = (savedDbUser: any): string => {
    const { role, name } = savedDbUser;
    const token = this._jwt.sign(
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

  public init = async (usecaseInitParams: CreateUserUsecaseInitParams): Promise<this> => {
    const {
      makeUserDbService,
      makeUserEntity,
      makeTeacherDbService,
      makePackageDbService,
      makePackageTransactionDbService,
      makeMinuteBankDbService,
      makeTeacherBalanceDbService,
      jwt,
      emailHandler,
    } = usecaseInitParams;
    this._userDbService = await makeUserDbService;
    this._userEntity = makeUserEntity;
    this._teacherDbService = await makeTeacherDbService;
    this._packageDbService = await makePackageDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._minuteBankDbService = await makeMinuteBankDbService;
    this._teacherBalanceDbService = await makeTeacherBalanceDbService;
    this._jwt = jwt;
    this._emailHandler = emailHandler;
    return this;
  };
}

export { CreateUserUsecase, CreateUserUsecaseResponse, CookieData };
