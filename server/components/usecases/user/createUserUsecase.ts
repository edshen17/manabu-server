import { MinuteBankDoc } from '../../../models/MinuteBank';
import { PackageDoc } from '../../../models/Package';
import { TeacherDoc } from '../../../models/Teacher';
import { TeacherBalanceDoc } from '../../../models/TeacherBalance';
import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { MinuteBankDbService } from '../../dataAccess/services/minuteBankDb';
import { PackageDbService } from '../../dataAccess/services/packagesDb';
import { PackageTransactionDbService } from '../../dataAccess/services/packageTransactionDb';
import { TeacherBalanceDbService } from '../../dataAccess/services/teacherBalanceDb';
import { TeacherDbService } from '../../dataAccess/services/teachersDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { makeMinuteBankEntity } from '../../entities/minuteBank';
import { makePackageEntity } from '../../entities/package';
import { makePackageTransactionEntity } from '../../entities/packageTransaction';
import { makeTeacherBalanceEntity } from '../../entities/teacherBalance';
import { makeUserEntity } from '../../entities/user';
import { makeTeacherEntity } from '../../entities/teacher';
import { EmailHandler } from '../../utils/email/emailHandler';
import { ControllerData, CurrentAPIUser, IUsecase } from '../abstractions/IUsecase';
import { AbstractCreateUsecase } from '../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../abstractions/AbstractUsecase';

type CreateUserUsecaseResponse =
  | { token: string; user: JoinedUserDoc; isLoginToken: boolean }
  | Error;

class CreateUserUsecase
  extends AbstractCreateUsecase<CreateUserUsecaseResponse>
  implements IUsecase<CreateUserUsecaseResponse>
{
  private userDbService!: UserDbService;
  private teacherDbService!: TeacherDbService;
  private packageDbService!: PackageDbService;
  private packageTransactionDbService!: PackageTransactionDbService;
  private minuteBankDbService!: MinuteBankDbService;
  private teacherBalanceDbService!: TeacherBalanceDbService;
  private jwt!: any;
  private emailHandler!: EmailHandler;

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { body } = controllerData.routeData;
    const { role, _id, dateRegistered } = body || {};
    return !role && !_id && !dateRegistered;
  };

  private _sendVerificationEmail = (userInstance: any): void => {
    const host = 'https://manabu.sg';
    const { name, verificationToken } = userInstance;
    this.emailHandler.sendEmail(
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
    this.emailHandler.sendEmail(
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

  public jwtToClient = (savedDbUser: any): string => {
    const { role, name } = savedDbUser;
    const token = this.jwt.sign(
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

  private _insertUser = async (
    userInstance: any,
    accessOptions: AccessOptions
  ): Promise<JoinedUserDoc> => {
    const savedDbUser = await this.userDbService.insert({
      modelToInsert: userInstance,
      accessOptions,
    });
    return savedDbUser;
  };

  private _insertTeacher = async (
    savedDbUser: JoinedUserDoc,
    accessOptions: AccessOptions
  ): Promise<TeacherDoc> => {
    const userId = savedDbUser._id;
    const modelToInsert = makeTeacherEntity.build({ userId });
    const savedDbTeacher = await this.teacherDbService.insert({
      modelToInsert,
      accessOptions,
    });
    return savedDbTeacher;
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

  private _insertTeacherPackages = async (
    savedDbUser: JoinedUserDoc,
    accessOptions: AccessOptions
  ): Promise<PackageDoc[]> => {
    const packagesToInsert = await this._createDefaultTeacherPackages(savedDbUser);
    const modelToInsert = await Promise.all(packagesToInsert);

    const newPackages = await this.packageDbService.insertMany({
      modelToInsert,
      accessOptions,
    });
    return newPackages;
  };

  private _insertAdminPackageTransaction = async (
    savedDbUser: JoinedUserDoc,
    accessOptions: AccessOptions
  ): Promise<PackageDoc> => {
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
    const newPackageTransaction = await this.packageTransactionDbService.insert({
      modelToInsert,
      accessOptions,
    });
    return newPackageTransaction;
  };

  private _insertAdminMinuteBank = async (
    savedDbUser: JoinedUserDoc,
    accessOptions: AccessOptions
  ): Promise<MinuteBankDoc> => {
    const minuteBankEntity = await makeMinuteBankEntity;
    const modelToInsert = await minuteBankEntity.build({
      hostedBy: process.env.MANABU_ADMIN_ID!,
      reservedBy: savedDbUser._id,
    });
    const newMinuteBank = await this.minuteBankDbService.insert({
      modelToInsert,
      accessOptions,
    });
    return newMinuteBank;
  };

  private _insertTeacherBalance = async (
    savedDbUser: JoinedUserDoc,
    accessOptions: AccessOptions
  ): Promise<TeacherBalanceDoc> => {
    const teacherBalanceEntity = await makeTeacherBalanceEntity;
    const modelToInsert = await teacherBalanceEntity.build({
      userId: savedDbUser._id,
    });
    const newTeacherBalance = this.teacherBalanceDbService.insert({
      modelToInsert,
      accessOptions,
    });
    return newTeacherBalance;
  };

  public handleTeacherCreation = async (
    savedDbUser: JoinedUserDoc,
    accessOptions: AccessOptions
  ): Promise<JoinedUserDoc> => {
    const joinedUserData = JSON.parse(JSON.stringify(savedDbUser));
    const teacherData: any = await this._insertTeacher(savedDbUser, accessOptions);
    const packages = await this._insertTeacherPackages(savedDbUser, accessOptions);

    await this._insertAdminPackageTransaction(savedDbUser, accessOptions);
    await this._insertAdminMinuteBank(savedDbUser, accessOptions);
    await this._insertTeacherBalance(savedDbUser, accessOptions);

    teacherData.packages = packages;
    joinedUserData.teacherData = teacherData;
    joinedUserData.teacherAppPending = true;
    return joinedUserData;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateUserUsecaseResponse> => {
    const { body, accessOptions } = props;
    const { isTeacherApp } = body || {};

    try {
      const userInstance = makeUserEntity.build(body);
      let savedDbUser = await this._insertUser(userInstance, accessOptions);
      if (isTeacherApp) {
        savedDbUser = await this.handleTeacherCreation(savedDbUser, accessOptions);
      }

      this._sendVerificationEmail(userInstance);

      if (process.env.NODE_ENV == 'production') {
        this._sendInternalEmail(userInstance, isTeacherApp);
      }

      return {
        token: this.jwtToClient(savedDbUser),
        user: savedDbUser,
        isLoginToken: true,
      };
    } catch (err) {
      throw err;
    }
  };

  public init = async (services: {
    makeUserDbService: Promise<UserDbService>;
    makeTeacherDbService: Promise<TeacherDbService>;
    makePackageDbService: Promise<PackageDbService>;
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeMinuteBankDbService: Promise<MinuteBankDbService>;
    makeTeacherBalanceDbService: Promise<TeacherBalanceDbService>;
    jwt: any;
    emailHandler: EmailHandler;
  }): Promise<this> => {
    const {
      makeUserDbService,
      makeTeacherDbService,
      makePackageDbService,
      makePackageTransactionDbService,
      makeMinuteBankDbService,
      makeTeacherBalanceDbService,
      jwt,
      emailHandler,
    } = services;
    this.userDbService = await makeUserDbService;
    this.teacherDbService = await makeTeacherDbService;
    this.packageDbService = await makePackageDbService;
    this.packageTransactionDbService = await makePackageTransactionDbService;
    this.minuteBankDbService = await makeMinuteBankDbService;
    this.teacherBalanceDbService = await makeTeacherBalanceDbService;
    this.jwt = jwt;
    this.emailHandler = emailHandler;
    return this;
  };
}

export { CreateUserUsecase, CreateUserUsecaseResponse };
