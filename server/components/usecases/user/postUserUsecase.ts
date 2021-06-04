import { PackageDoc } from '../../../models/Package';
import { TeacherDoc } from '../../../models/Teacher';
import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { PackageDbService } from '../../dataAccess/services/packagesDb';
import { TeacherDbService } from '../../dataAccess/services/teachersDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { packageEntity } from '../../entities/package';
import { userEntity, teacherEntity } from '../../entities/user/index';
import { EmailHandler } from '../../utils/email/emailHandler';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

class PostUserUsecase implements IUsecase {
  private userDbService!: UserDbService;
  private teacherDbService!: TeacherDbService;
  private packageDbService!: PackageDbService;
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
        id: savedDbUser._id,
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
    const modelToInsert = teacherEntity.build({ userId });
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
      const packageProperties = {
        hostedBy: savedDbUser._id,
        lessonAmount: pkg.lessonAmount,
        packageType: pkg.type,
      };
      const modelToInsert = packageEntity.build(packageProperties);
      const newPackage = await this.packageDbService.insert({
        modelToInsert,
        accessOptions: this.defaultAccessOptions,
      });
      savedDbPackages.push(newPackage);
    });

    return savedDbPackages;
  };

  // private _insertAdminPackageTransaction = async (savedDbUser: JoinedUserDoc): Promise<PackageDoc[]> {

  // };

  public makeRequest = async (controllerData: ControllerData): Promise<string | Error> => {
    const { routeData } = controllerData;
    const { body } = routeData;
    const isTeacherApp = body.isTeacherApp;
    const userInstance = userEntity.build(body);

    try {
      const savedDbUser = await this._insertUser(userInstance);

      if (isTeacherApp) {
        await this._insertTeacher(savedDbUser);
        await this._insertTeacherPackages(savedDbUser);
        // await this._insertAdminPackageTransaction(savedDbUser);
        // await this._insertAdminMinuteBank(savedDbUser);
        // await this._insertTeacherBalance(savedDbUser);
      }

      this._sendVerificationEmail(userInstance);

      if (process.env.NODE_ENV == 'production') {
        this._sendInternalEmail(userInstance, isTeacherApp);
      }

      return this._jwtToClient(this.jwt, savedDbUser);
    } catch (err) {
      throw new Error('An error has occured during user creation.');
    }
  };

  public build = async (services: {
    makeUserDbService: Promise<UserDbService>;
    makeTeacherDbService: Promise<TeacherDbService>;
    makePackageDbService: Promise<PackageDbService>;
    jwt: any;
    emailHandler: EmailHandler;
  }): Promise<this> => {
    this.userDbService = await services.makeUserDbService;
    this.teacherDbService = await services.makeTeacherDbService;
    this.packageDbService = await services.makePackageDbService;
    this.jwt = services.jwt;
    this.emailHandler = services.emailHandler;
    return this;
  };
}

export { PostUserUsecase };
