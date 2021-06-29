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
  bcrypt: any;
};
type JoinedTeacherDoc = TeacherDoc & { packages: [PackageDoc] };
type JoinedUserDoc = UserDoc & { teacherAppPending: boolean; teacherData: JoinedTeacherDoc };

class UserDbService
  extends AbstractDbService<PartialUserDbServiceInitParams, JoinedUserDoc>
  implements IDbService<PartialUserDbServiceInitParams, JoinedUserDoc>
{
  private _teacherDbService!: TeacherDbService;
  private _packageDbService!: PackageDbService;
  private _bcrypt!: any;
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {
        email: 0,
        password: 0,
        verificationToken: 0,
        settings: 0,
        commMethods: 0,
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
    const dbUserData = await this.findOne(dbServiceParams);
    if (!dbUserData) {
      return null;
    }
    if (!dbUserData.password) {
      throw new Error(
        'It seems that you signed up previously through a third-party service like Google.'
      );
    }

    const isPasswordValid = this._bcrypt.compareSync(inputtedPassword, dbUserData.password);
    if (isPasswordValid) {
      const { password, ...partialDbUserDataWithoutPassword } = dbUserData;
      return partialDbUserDataWithoutPassword;
    } else {
      throw new Error('Username or password incorrect.');
    }
  };

  protected _dbDataReturnTemplate = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    asyncCallback: any
  ): Promise<any> => {
    const dbUserData = await this._returnJoinedUser(dbServiceAccessOptions, asyncCallback);
    return dbUserData;
  };

  private _returnJoinedUser = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    asyncCallback: Promise<JoinedUserDoc>
  ): Promise<any> => {
    const dbUserData = await this._grantAccess(dbServiceAccessOptions, asyncCallback);
    if (dbUserData) {
      return await this._joinUserTeacherPackage(dbUserData, dbServiceAccessOptions);
    }
  };

  private _joinUserTeacherPackage = async (
    dbUserData: JoinedUserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<JoinedUserDoc> => {
    const userCopy: any = this._cloneDeep(dbUserData);
    const _id: string = dbUserData._id;
    const teacher: TeacherDoc = await this._teacherDbService.findById({
      _id,
      dbServiceAccessOptions,
    });

    const packages = await this._packageDbService.find({
      searchQuery: { hostedBy: _id },
      dbServiceAccessOptions,
    });

    if (teacher) {
      userCopy.teacherAppPending = !teacher.isApproved;
      userCopy.teacherData = teacher;
      userCopy.teacherData.packages = packages;
    }

    return userCopy;
  };

  protected _initTemplate = async (partialDbServiceInitParams: PartialUserDbServiceInitParams) => {
    const { makeTeacherDbService, makePackageDbService, bcrypt } = partialDbServiceInitParams;
    this._teacherDbService = await makeTeacherDbService;
    this._packageDbService = await makePackageDbService;
    this._bcrypt = bcrypt;
  };
}

export { UserDbService, JoinedUserDoc };
