import { userEntity, teacherEntity } from '../../entities/user/index';
import { IUsecase } from '../abstractions/IUsecase';

class PostUserUsecase implements IUsecase {
  private userDbService: any;
  private teacherDbService: any;
  private jwt: any;
  private emailHandler: any;

  constructor(userDbService: any, teacherDbService: any, jwt: any, emailHandler: any) {
    this.userDbService = userDbService;
    this.teacherDbService = teacherDbService;
    this.jwt = jwt;
    this.emailHandler = emailHandler;
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
    const exists = await this.userDbService.findOne({ email: userInstance.getEmail() });
    if (exists && !isTeacherApp) {
      throw new Error(
        'You seem to already have an user account. Log in using the link below to connect that account with your teacher one.'
      );
    }
  };

  private _ensureUniqueTeacher = async (userData: any): Promise<void> => {
    const exists = await this.teacherDbService.findByUserId(userData._id);
    if (exists) {
      throw new Error('Teacher already exists.');
    }
  };

  private _insertUserIntoDb = async (userInstance: any): Promise<any> => {
    const savedDbUser = await this.userDbService.insert({
      name: userInstance.getName(),
      email: userInstance.getEmail(),
      password: userInstance.getPassword(),
      profileImage: userInstance.getProfileImage(),
      verificationToken: userInstance.getVerificationToken(),
    });
    this.userDbService.clearCollectionCache();
    return savedDbUser;
  };

  private _insertTeacherIntoDb = async (savedDbUser: any): Promise<any> => {
    const teacherInstance = teacherEntity.build({ userId: savedDbUser._id });
    const savedDbTeacher = await this.teacherDbService.insert({
      userId: teacherInstance.getUserId(),
    });
    this.teacherDbService.clearCollectionCache();
    return savedDbTeacher;
  };

  public build = async (userData: any): Promise<any> => {
    const isTeacherApp = userData.isTeacherApp;
    const user = userEntity.build(userData);
    try {
      await this._ensureUniqueUser(userData, isTeacherApp);
      const savedDbUser = await this._insertUserIntoDb(user);

      if (isTeacherApp) {
        await this._ensureUniqueTeacher(savedDbUser);
        await this._insertTeacherIntoDb(savedDbUser);
      }

      this._sendVerificationEmail(user);
      this._sendInternalEmail(user, isTeacherApp);

      return this._jwtToClient(this.jwt, savedDbUser);
    } catch (err) {
      throw err;
    }
  };
}

export { PostUserUsecase };
