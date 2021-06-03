import { PackageDoc } from '../../../models/Package';
import { TeacherDoc } from '../../../models/Teacher';
import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { PackageDbService } from '../../dataAccess/services/packagesDb';
import { TeacherDbService } from '../../dataAccess/services/teachersDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
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
    this.emailHandler.sendEmail(
      userInstance.getEmail(),
      'NOREPLY',
      'Manabu email verification',
      'verificationEmail',
      {
        name: userInstance.getName(),
        host,
        verificationToken: userInstance.getVerificationToken(),
      }
    );
  };

  private _sendInternalEmail = (userInstance: any, isTeacherApp: boolean): void => {
    const userType = isTeacherApp ? 'teacher' : 'user';
    this.emailHandler.sendEmail(
      'manabulessons@gmail.com',
      'NOREPLY',
      `A new ${userType} signed up`,
      'internalNewSignUpEmail',
      {
        name: userInstance.getName(),
        email: userInstance.getEmail(),
        userType,
      }
    );
  };

  private _jwtToClient = (jwt: any, savedDbUser: any): string => {
    const token = jwt.sign(
      {
        id: savedDbUser._id,
        role: savedDbUser.role,
        name: savedDbUser.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 24 * 60 * 60 * 7,
      }
    );
    return token;
  };

  // TODO: make schema unique then remove this
  private _ensureUniqueUser = async (userData: any, isTeacherApp: boolean): Promise<void> => {
    const userInstance = userEntity.build(userData);
    const exists = await this.userDbService.findOne({
      searchQuery: { email: userInstance.getEmail() },
      accessOptions: this.defaultAccessOptions,
    });
    if (exists && !isTeacherApp) {
      throw new Error('You seem to already have an account registered with that email.');
    }
  };

  // TODO: make schema unique then remove this
  private _ensureUniqueTeacher = async (userData: JoinedUserDoc): Promise<void> => {
    const exists = await this.teacherDbService.findById({
      id: userData._id,
      accessOptions: this.defaultAccessOptions,
    });
    if (exists) {
      throw new Error('A teacher with that id already exists.');
    }
  };

  private _insertUserIntoDb = async (userInstance: any): Promise<JoinedUserDoc> => {
    const savedDbUser = await this.userDbService.insert({
      modelToInsert: {
        name: userInstance.getName(),
        email: userInstance.getEmail(),
        password: userInstance.getPassword(),
        profileImage: userInstance.getProfileImage(),
        verificationToken: userInstance.getVerificationToken(),
      },
      accessOptions: this.defaultAccessOptions,
    });
    return savedDbUser;
  };

  private _insertTeacherIntoDb = async (savedDbUser: JoinedUserDoc): Promise<TeacherDoc> => {
    const userId = savedDbUser._id;
    const teacherInstance = teacherEntity.build({ userId });
    const savedDbTeacher = await this.teacherDbService.insert({
      modelToInsert: { userId: teacherInstance.getUserId() },
      accessOptions: this.defaultAccessOptions,
    });
    return savedDbTeacher;
  };

  // private _insertDefaultPackagesIntoDb = async (
  //   savedDbUser: JoinedUserDoc
  // ): Promise<PackageDoc> => {};

  public makeRequest = async (controllerData: ControllerData): Promise<string | Error> => {
    const { routeData } = controllerData;
    const { body } = routeData;
    const isTeacherApp = body.isTeacherApp;
    const userInstance = userEntity.build(body);

    try {
      await this._ensureUniqueUser(body, isTeacherApp);
      const savedDbUser = await this._insertUserIntoDb(userInstance);

      if (isTeacherApp) {
        await this._ensureUniqueTeacher(savedDbUser);
        await this._insertTeacherIntoDb(savedDbUser);
        // create 3 default packages, make appointment with admin,
      }

      this._sendVerificationEmail(userInstance);

      if (process.env.NODE_ENV == 'production') {
        this._sendInternalEmail(userInstance, isTeacherApp);
      }

      return this._jwtToClient(this.jwt, savedDbUser);
    } catch (err) {
      throw err;
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
