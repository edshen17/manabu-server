import { DbServiceAccessOptions, DbServiceParams, IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDbService } from '../teacher/teacherDbService';
import { PackageDbService } from '../package/packageDbService';
import { UserDoc } from '../../../../models/User';
import { TeacherDoc } from '../../../../models/Teacher';
import { PackageDoc } from '../../../../models/Package';

type PartialUserDbServiceInitParams = {
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  comparePassword: any;
};
type JoinedTeacherDoc = TeacherDoc & { packages: [PackageDoc] };
type JoinedUserDoc = UserDoc & { teacherAppPending: boolean; teacherData: JoinedTeacherDoc };

class UserDbService
  extends AbstractDbService<PartialUserDbServiceInitParams, JoinedUserDoc>
  implements IDbService<PartialUserDbServiceInitParams, JoinedUserDoc>
{
  private _teacherDbService!: TeacherDbService;
  private _packageDbService!: PackageDbService;
  private _comparePassword!: any;
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {
        email: 0,
        password: 0,
        verificationToken: 0,
        settings: 0,
        commMethods: 0,
        isEmailVerified: 0,
      },
      adminView: {
        password: 0,
        verificationToken: 0,
      },
      selfView: {
        password: 0,
        verificationToken: 0,
      },
      overrideView: {
        verificationToken: 0,
      },
    };
  }

  public authenticateUser = async (
    dbServiceParams: DbServiceParams,
    inputtedPassword: string
  ): Promise<any> => {
    const userData = await this.findOne(dbServiceParams);
    if (!userData) {
      return null;
    }
    if (!userData.password) {
      throw new Error(
        'It seems that you signed up previously through a third-party service like Google.'
      );
    }

    const isPasswordValid = this._comparePassword(inputtedPassword, userData.password);
    if (isPasswordValid) {
      const { password, ...partialuserDataWithoutPassword } = userData;
      return partialuserDataWithoutPassword;
    } else {
      throw new Error('Username or password incorrect.');
    }
  };

  protected _dbDataReturnTemplate = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    asyncCallback: any
  ): Promise<any> => {
    const userData = await this._returnJoinedUser(dbServiceAccessOptions, asyncCallback);
    return userData;
  };

  private _returnJoinedUser = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    asyncCallback: Promise<JoinedUserDoc>
  ): Promise<any> => {
    const userData = await this._grantAccess(dbServiceAccessOptions, asyncCallback);
    if (userData) {
      return await this._joinUserTeacherPackage(userData, dbServiceAccessOptions);
    }
  };

  private _joinUserTeacherPackage = async (
    userData: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<JoinedUserDoc> => {
    const userCopy: any = this._cloneDeep(userData);
    const _id: string = userData._id;
    const teacherData: TeacherDoc = await this._teacherDbService.findById({
      _id,
      dbServiceAccessOptions,
    });

    const packages = await this._packageDbService.find({
      searchQuery: { hostedBy: _id },
      dbServiceAccessOptions,
    });

    if (teacherData) {
      userCopy.teacherAppPending = !teacherData.isApproved;
      userCopy.teacherData = teacherData;
      userCopy.teacherData.packages = packages;
    }

    return userCopy;
  };

  protected _initTemplate = async (partialDbServiceInitParams: PartialUserDbServiceInitParams) => {
    const { makeTeacherDbService, makePackageDbService, comparePassword } =
      partialDbServiceInitParams;
    this._teacherDbService = await makeTeacherDbService;
    this._packageDbService = await makePackageDbService;
    this._comparePassword = comparePassword;
  };
}

export { UserDbService, JoinedUserDoc };
