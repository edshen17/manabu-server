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
import { makeUserEntity, makeTeacherEntity } from '../../entities/user/';
import { EmailHandler } from '../../utils/email/emailHandler';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

class PostUserUsecase implements IUsecase {
  private userDbService!: UserDbService;
  private teacherDbService!: TeacherDbService;
  private packageDbService!: PackageDbService;
  private packageTransactionDbService!: PackageTransactionDbService;
  private minuteBankDbService!: MinuteBankDbService;
  private teacherBalanceDbService!: TeacherBalanceDbService;
  private jwt!: any;
  private emailHandler!: EmailHandler;
  private defaultAccessOptions!: AccessOptions;
  constructor() {
    this.defaultAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: true,
    };
  }

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

  private _jwtToClient = (jwt: any, savedDbUser: any): string => {
    const { role, name } = savedDbUser;
    const token = jwt.sign(
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

  private _insertUser = async (userInstance: any): Promise<JoinedUserDoc> => {
    const savedDbUser = await this.userDbService.insert({
      modelToInsert: userInstance,
      accessOptions: this.defaultAccessOptions,
    });
    return savedDbUser;
  };

  private _insertTeacher = async (savedDbUser: JoinedUserDoc): Promise<TeacherDoc> => {
    const userId = savedDbUser._id;
    const modelToInsert = makeTeacherEntity.build({ userId });
    const savedDbTeacher = await this.teacherDbService.insert({
      modelToInsert,
      accessOptions: this.defaultAccessOptions,
    });
    return savedDbTeacher;
  };

  private _insertTeacherPackages = async (savedDbUser: JoinedUserDoc): Promise<PackageDoc[]> => {
    const defaultPackages = [
      { type: 'mainichi', lessonAmount: 22 },
      { type: 'moderate', lessonAmount: 12 },
      { type: 'light', lessonAmount: 5 },
    ];
    const savedDbPackages: PackageDoc[] = [];

    defaultPackages.forEach(async (pkg) => {
      const packageProperties: { hostedBy: string; lessonAmount: number; packageType: string } = {
        hostedBy: savedDbUser._id,
        lessonAmount: pkg.lessonAmount,
        packageType: pkg.type,
      };
      const modelToInsert = makePackageEntity.build(packageProperties);
      const newPackage = await this.packageDbService.insert({
        modelToInsert,
        accessOptions: this.defaultAccessOptions,
      });
      savedDbPackages.push(newPackage);
    });

    return savedDbPackages;
  };

  private _insertAdminPackageTransaction = async (
    savedDbUser: JoinedUserDoc
  ): Promise<PackageDoc> => {
    const packageTransactionEntity = await makePackageTransactionEntity;
    const modelToInsert = await packageTransactionEntity.build({
      hostedBy: process.env.MANABU_ADMIN_ID,
      reservedBy: savedDbUser._id,
      packageId: process.env.MANABU_ADMIN_PKG_ID,
      reservationLength: 60,
      remainingAppointments: 1,
      transactionDetails: {
        currency: 'SGD',
        subTotal: '0',
        total: '0',
      },
    });
    const newPackageTransaction = this.packageTransactionDbService.insert({
      modelToInsert,
      accessOptions: this.defaultAccessOptions,
    });
    return newPackageTransaction;
  };

  private _insertAdminMinuteBank = async (savedDbUser: JoinedUserDoc): Promise<MinuteBankDoc> => {
    const minuteBankEntity = await makeMinuteBankEntity;
    const modelToInsert = await minuteBankEntity.build({
      hostedBy: process.env.MANABU_ADMIN_ID,
      reservedBy: savedDbUser._id,
    });
    const newMinuteBank = this.minuteBankDbService.insert({
      modelToInsert,
      accessOptions: this.defaultAccessOptions,
    });
    return newMinuteBank;
  };

  private _insertTeacherBalance = async (
    savedDbUser: JoinedUserDoc
  ): Promise<TeacherBalanceDoc> => {
    const teacherBalanceEntity = await makeTeacherBalanceEntity;
    const modelToInsert = await teacherBalanceEntity.build({
      userId: savedDbUser._id,
    });
    const newTeacherBalance = this.teacherBalanceDbService.insert({
      modelToInsert,
      accessOptions: this.defaultAccessOptions,
    });
    return newTeacherBalance;
  };

  public makeRequest = async (controllerData: ControllerData): Promise<string | Error> => {
    const { routeData } = controllerData;
    const { body } = routeData;
    const isTeacherApp = body.isTeacherApp;

    try {
      const userInstance = makeUserEntity.build(body);
      const savedDbUser = await this._insertUser(userInstance);

      if (isTeacherApp) {
        await this._insertTeacher(savedDbUser);
        await this._insertTeacherPackages(savedDbUser);
        await this._insertAdminPackageTransaction(savedDbUser);
        await this._insertAdminMinuteBank(savedDbUser);
        await this._insertTeacherBalance(savedDbUser);
      }

      this._sendVerificationEmail(userInstance);

      if (process.env.NODE_ENV == 'production') {
        this._sendInternalEmail(userInstance, isTeacherApp);
      }

      return this._jwtToClient(this.jwt, savedDbUser);
    } catch (err) {
      console.log(err.message);
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

export { PostUserUsecase };
