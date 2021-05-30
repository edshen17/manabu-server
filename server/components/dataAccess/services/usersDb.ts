import { AccessOption, IDbOperations } from '../abstractions/IDbOperations';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';
import { TeacherDbService } from './teachersDb';
import { PackageDbService } from './packagesDb';
import { TeacherDoc } from '../../../models/Teacher';

class UserDbService extends CommonDbOperations implements IDbOperations {
  private teacherDbService: TeacherDbService;
  private packageDbService: PackageDbService;
  constructor(props: any) {
    super(props.userDb);
    const { teacherDbService, packageDbService } = props;
    this.teacherDbService = teacherDbService;
    this.packageDbService = packageDbService;
  }

  private _joinUserTeacher = async (user: any): Promise<any> => {
    const userCopy: any = JSON.parse(JSON.stringify(user));
    const id = user._id;
    const teacher: TeacherDoc = await this.teacherDbService.findById({
      id,
      accessOptions: { isProtectedResource: false, isCurrentAPIUserPermitted: true },
    });
    // const packages = await this.packageDbService.findByHostedBy(user._id);
    const packages = {}; //TODO FILL OUT
    if (teacher) {
      userCopy.teacherAppPending = !teacher.isApproved;
      userCopy.teacherData = teacher;
      userCopy.teacherData.packages = packages;
    }
    return userCopy;
  };

  public findOne = async (params: {
    searchQuery: {};
    accessOptions: AccessOption;
  }): Promise<any | Error> => {
    const { searchQuery, accessOptions } = params;
    const asyncCallback = this.dbModel.findOne(searchQuery);
    const user = this._grantAccess(accessOptions, asyncCallback);
    // if (user) return await this._joinUserTeacher(user);
    return user;
  };

  public findById = async (params: {
    id: string;
    accessOptions: AccessOption;
  }): Promise<any | Error> => {
    const { id, accessOptions } = params;
    const asyncCallback = this.dbModel.findById(id);
    const user = this._grantAccess(accessOptions, asyncCallback);
    // if (user) return await this._joinUserTeacher(user);
    return user;
  };

  public insert = async (params: {
    modelToInsert: {};
    accessOptions: AccessOption;
  }): Promise<any | Error> => {
    const { modelToInsert, accessOptions } = params;
    const asyncCallback = this.dbModel.create(modelToInsert);
    const user = this._grantAccess(accessOptions, asyncCallback);
    // if (user) return await this._joinUserTeacher(user);
    return user;
  };

  public update = async (params: {
    searchQuery: {};
    updateParams: {};
    accessOptions: any;
  }): Promise<any | Error> => {
    const { searchQuery, updateParams, accessOptions } = params;
    const asyncCallback = this.dbModel.findOneAndUpdate(searchQuery, updateParams);
    const user = this._grantAccess(accessOptions, asyncCallback);
    // if (user) return await this._joinUserTeacher(user);
    return user;
  };

  public build = async (makeDb: any, teacherDbService: any, packageDbService: any) => {
    await makeDb();
    this.teacherDbService = await teacherDbService;
    this.packageDbService = await packageDbService;
    return this;
  };
}

export { UserDbService };
