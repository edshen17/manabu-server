import { AccessOptions, DbParams, IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations } from '../../abstractions/CommonDbOperations';
import { TeacherDbService } from '../teacher/teacherDbService';
import { PackageDbService } from '../package/packageDbService';
import { UserDoc } from '../../../../models/User';
import { TeacherDoc } from '../../../../models/Teacher';
import { PackageDoc } from '../../../../models/Package';

type JoinedTeacherDoc = TeacherDoc & { packages: [PackageDoc] };
type JoinedUserDoc = UserDoc & { teacherAppPending: boolean; teacherData: JoinedTeacherDoc };

class UserDbService
  extends CommonDbOperations<JoinedUserDoc>
  implements IDbOperations<JoinedUserDoc>
{
  private teacherDbService!: TeacherDbService;
  private packageDbService!: PackageDbService;
  private passwordLib!: any;
  constructor() {
    super();
    this.defaultSelectOptions = {
      defaultSettings: {
        email: 0,
        password: 0,
        verificationToken: 0,
        settings: 0,
      },
      adminSettings: {
        password: 0,
        verificationToken: 0,
      },
      isSelfSettings: {
        password: 0,
        verificationToken: 0,
      },
      overrideSettings: {
        verificationToken: 0,
      },
    };
  }

  public authenticateUser = async (dbParams: DbParams, inputtedPassword: string): Promise<any> => {
    const user = await this.findOne(dbParams);
    if (!user) {
      return null;
    }
    if (!user.password) {
      throw new Error(
        'It seems that you signed up previously through a third-party service like Google.'
      );
    }

    const passwordIsValid = this.passwordLib.compareSync(inputtedPassword, user.password);
    if (passwordIsValid) {
      const { password, ...partialUserWithoutPassword } = user;
      return partialUserWithoutPassword;
    } else {
      throw new Error('Username or password incorrect.');
    }
  };

  protected _dbReturnTemplate = async (
    accessOptions: AccessOptions,
    asyncCallback: any
  ): Promise<any> => {
    return await this._returnJoinedUser(accessOptions, asyncCallback);
  };

  private _returnJoinedUser = async (
    accessOptions: AccessOptions,
    asyncCallback: Promise<JoinedUserDoc>
  ): Promise<any> => {
    const user = await this._grantAccess(accessOptions, asyncCallback);
    if (user) {
      return await this._joinUserTeacherPackage(user, accessOptions);
    }
  };

  private _joinUserTeacherPackage = async (
    user: JoinedUserDoc,
    accessOptions: AccessOptions
  ): Promise<JoinedUserDoc> => {
    const userCopy: any = JSON.parse(JSON.stringify(user));
    const _id: string = user._id;
    const teacher: TeacherDoc = await this.teacherDbService.findById({
      _id,
      accessOptions,
    });

    const packages = await this.packageDbService.find({
      searchQuery: { hostedBy: _id },
      accessOptions,
    });

    if (teacher) {
      userCopy.teacherAppPending = !teacher.isApproved;
      userCopy.teacherData = teacher;
      userCopy.teacherData.packages = packages;
    }

    return userCopy;
  };

  public init = async (props: {
    makeDb: any;
    dbModel: any;
    cloneDeep: any;
    makeTeacherDbService: Promise<TeacherDbService>;
    makePackageDbService: Promise<PackageDbService>;
    passwordLib: any;
  }) => {
    const { makeDb, dbModel, cloneDeep, makeTeacherDbService, makePackageDbService, passwordLib } =
      props;
    await makeDb();
    this.dbModel = dbModel;
    this.teacherDbService = await makeTeacherDbService;
    this.packageDbService = await makePackageDbService;
    this.cloneDeep = cloneDeep;
    this.passwordLib = passwordLib;
    return this;
  };
}

export { UserDbService, JoinedUserDoc };
