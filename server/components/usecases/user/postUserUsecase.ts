import { UserDoc } from '../../../models/User';
import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { TeacherDbService } from '../../dataAccess/services/teachersDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { userEntity, teacherEntity } from '../../entities/user/index';
import { EmailHandler } from '../../utils/email/emailHandler';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

class PostUserUsecase implements IUsecase {
  private userDbService!: UserDbService;
  private teacherDbService!: TeacherDbService;
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

  private _ensureUniqueUser = async (userData: any, isTeacherApp: boolean): Promise<void> => {
    const userInstance = userEntity.build(userData);
    const exists = await this.userDbService.findOne({
      searchQuery: { email: userInstance.getEmail() },
      accessOptions: this.defaultAccessOptions,
    });
    if (exists && !isTeacherApp) {
      throw new Error(
        'You seem to already have an user account. Log in using the link below to connect that account with your teacher one.'
      );
    }
  };

  private _ensureUniqueTeacher = async (userData: any): Promise<void> => {
    const exists = await this.teacherDbService.findById({
      id: userData._id,
      accessOptions: this.defaultAccessOptions,
    });
    if (exists) {
      throw new Error('A teacher with that id already exists.');
    }
  };

  private _insertUserIntoDb = async (userInstance: any): Promise<any> => {
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

  private _insertTeacherIntoDb = async (savedDbUser: any): Promise<any> => {
    const userId = savedDbUser._id;
    const teacherInstance = teacherEntity.build({ userId });
    const savedDbTeacher = await this.teacherDbService.insert({
      modelToInsert: { userId: teacherInstance.getUserId() },
      accessOptions: this.defaultAccessOptions,
    });
    return savedDbTeacher;
  };

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
      }

      this._sendVerificationEmail(userInstance);
      this._sendInternalEmail(userInstance, isTeacherApp);

      return this._jwtToClient(this.jwt, savedDbUser);
    } catch (err) {
      throw err;
    }
  };

  public build = async (services: {
    makeUserDbService: Promise<UserDbService>;
    makeTeacherDbService: Promise<TeacherDbService>;
    jwt: any;
    emailHandler: EmailHandler;
  }): Promise<this> => {
    this.userDbService = await services.makeUserDbService;
    this.teacherDbService = await services.makeTeacherDbService;
    this.jwt = services.jwt;
    this.emailHandler = services.emailHandler;
    return this;
  };
}

export { PostUserUsecase };
