import { AccessOptions, DbParams, IDbOperations } from '../abstractions/IDbOperations';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';
import { TeacherDbService } from './teachersDb';
import { PackageDbService } from './packagesDb';
import { UserDoc } from '../../../models/User';
import { TeacherDoc } from '../../../models/Teacher';
import { PackageDoc } from '../../../models/Package';

type JoinedTeacherDoc = TeacherDoc & { packages: [PackageDoc] };
type JoinedUserDoc = UserDoc & { teacherAppPending: boolean; teacherData: JoinedTeacherDoc };

class UserDbService
  extends CommonDbOperations<JoinedUserDoc>
  implements IDbOperations<JoinedUserDoc>
{
  private teacherDbService!: TeacherDbService;
  private packageDbService!: PackageDbService;
  constructor(props: any) {
    super(props.userDb);
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
    };
  }

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

  private _returnJoinedUser = async (
    accessOptions: AccessOptions,
    asyncCallback: Promise<JoinedUserDoc>
  ): Promise<any> => {
    const user = await this._grantAccess(accessOptions, asyncCallback);
    if (user) {
      return await this._joinUserTeacherPackage(user, accessOptions);
    }
  };

  protected _dbReturnTemplate = async (
    accessOptions: AccessOptions,
    asyncCallback: any
  ): Promise<any> => {
    return await this._returnJoinedUser(accessOptions, asyncCallback);
  };

  public init = async (props: {
    makeDb: any;
    makeTeacherDbService: Promise<TeacherDbService>;
    makePackageDbService: Promise<PackageDbService>;
  }) => {
    const { makeDb, makeTeacherDbService, makePackageDbService } = props;
    await makeDb();
    this.teacherDbService = await makeTeacherDbService;
    this.packageDbService = await makePackageDbService;
    return this;
  };
}

export { UserDbService, JoinedUserDoc };
