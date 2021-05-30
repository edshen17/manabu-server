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
  private teacherDbService: TeacherDbService;
  private packageDbService: PackageDbService;
  constructor(props: any) {
    super(props.userDb);
    const { teacherDbService, packageDbService } = props;
    this.teacherDbService = teacherDbService;
    this.packageDbService = packageDbService;
  }

  private _joinUserTeacherPackage = async (user: any): Promise<JoinedUserDoc> => {
    const userCopy: any = JSON.parse(JSON.stringify(user));
    const id: string = user._id;
    const accessOptions: AccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
    };
    const teacher: TeacherDoc = await this.teacherDbService.findById({
      id,
      accessOptions,
    });

    const packages = await this.packageDbService.find({
      searchQuery: { hostedBy: id },
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
      return await this._joinUserTeacherPackage(user);
    } else throw new Error('User not found');
  };

  public findOne = async (params: DbParams): Promise<JoinedUserDoc> => {
    const { searchQuery, accessOptions } = params;
    const asyncCallback = this.dbModel.findOne(searchQuery);
    return await this._returnJoinedUser(accessOptions, asyncCallback);
  };

  public findById = async (params: DbParams): Promise<JoinedUserDoc> => {
    const { id, accessOptions } = params;
    const asyncCallback = this.dbModel.findById(id).lean();
    return await this._returnJoinedUser(accessOptions, asyncCallback);
  };

  public insert = async (params: DbParams): Promise<JoinedUserDoc> => {
    const { modelToInsert, accessOptions } = params;
    const asyncCallback = this.dbModel.create(modelToInsert);
    return await this._returnJoinedUser(accessOptions, asyncCallback);
  };

  public update = async (params: DbParams): Promise<JoinedUserDoc> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const asyncCallback = this.dbModel.findOneAndUpdate(searchQuery, updateParams).lean();
    return await this._returnJoinedUser(accessOptions, asyncCallback);
  };

  public build = async (makeDb: any, makeTeacherDbService: any, makePackageDbService: any) => {
    await makeDb();
    this.teacherDbService = await makeTeacherDbService;
    this.packageDbService = await makePackageDbService;
    return this;
  };
}

export { UserDbService };
