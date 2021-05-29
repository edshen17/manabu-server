import { IDbOperations } from '../abstractions/IDbOperations';
import { UserDoc } from '../../../models/User';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';
import { TeacherDbService } from './teachersDb';
import { PackageDbService } from './packagesDb';

class UserDbService extends CommonDbOperations implements IDbOperations {
  private userDb: any;
  private teacherDbService: TeacherDbService;
  private packageDbService: PackageDbService;

  constructor(props: any) {
    super();
    this.userDb = props.userDb;
    this.teacherDbService = props.teacherDbService;
    this.packageDbService = props.packageDbService;
  }

  private _joinUserTeacher = async (user: any): Promise<any> => {
    const userCopy = JSON.parse(JSON.stringify(user));
    const teacher = await this.teacherDbService.findByUserId(user._id);
    // const packages = await this.packageDbService.findByHostedBy(user._id);
    const packages = {}; //TODO FILL OUT
    if (teacher) {
      userCopy.teacherAppPending = !teacher.isApproved;
      userCopy.teacherData = teacher;
      userCopy.teacherData.packages = packages;
    }
    return userCopy;
  };

  //TODO: findById with admin stuff
  public findById = async (id: string, currentAPIUser: any): Promise<any> => {
    const user: UserDoc = await this.userDb.findById(id);
    if (user) return await this._joinUserTeacher(user);
    else throw new Error('User not found.');
  };

  public findOne = async (searchQuery: {}): Promise<any> => {
    const user: UserDoc = await this.userDb.findOne(searchQuery);
    if (user) return await this._joinUserTeacher(user);
    else throw new Error('User not found.');
  };

  //TODO: Finish with join
  public insert = async (modelToInsert: {}): Promise<any> => {
    const result = await this.userDb.create(modelToInsert);
    return result;
  };

  //TODO: Finish
  public update = async (searchQuery: {}): Promise<any> => {
    const result = await this.userDb.create(searchQuery);
    return result;
  };
}

export { UserDbService };
