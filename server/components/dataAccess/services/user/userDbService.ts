import { DbServiceAccessOptions, DbServiceParams, IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDbService } from '../teacher/teacherDbService';
import { PackageDbService } from '../package/packageDbService';
import { UserDoc } from '../../../../models/User';
import { TeacherDoc } from '../../../../models/Teacher';
import { PackageDoc } from '../../../../models/Package';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';

type OptionalUserDbServiceInitParams = {
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  comparePassword: any;
};
type JoinedTeacherDoc = TeacherDoc & { packages: [PackageDoc] };
type JoinedUserDoc = UserDoc & { teacherAppPending: boolean; teacherData: JoinedTeacherDoc };

class UserDbService extends AbstractDbService<OptionalUserDbServiceInitParams, JoinedUserDoc> {
  private _teacherDbService!: TeacherDbService;
  private _packageDbService!: PackageDbService;
  private _comparePassword!: any;
  private _packageTransactionDbService!: PackageTransactionDbService;

  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {
        email: 0,
        password: 0,
        verificationToken: 0,
        settings: 0,
        contactMethods: 0,
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
      searchQuery: { hostedById: _id },
      dbServiceAccessOptions,
    });

    if (teacherData) {
      userCopy.teacherData = teacherData;
      userCopy.teacherData.packages = packages;
    }

    return userCopy;
  };

  public updateManyDbDependencies = async (savedDbUser?: JoinedUserDoc) => {
    if (savedDbUser) {
      const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
      const userDependencyData = await this.findById({
        _id: savedDbUser._id,
        dbServiceAccessOptions,
      });
      const updateDbDependencies = false;
      const hostedByDependencies = await this._packageTransactionDbService.find({
        searchQuery: { hostedById: savedDbUser._id },
        dbServiceAccessOptions,
      });
      const reservedByDependencies = await this._packageTransactionDbService.find({
        searchQuery: { reservedById: savedDbUser._id },
        dbServiceAccessOptions,
      });
      const preUpdatePackageTransactions = [hostedByDependencies, reservedByDependencies].flat();
      await this._packageTransactionDbService.updateMany({
        searchQuery: { hostedById: savedDbUser._id },
        updateParams: { hostedByData: userDependencyData },
        dbServiceAccessOptions,
        updateDbDependencies,
      });
      await this._packageTransactionDbService.updateMany({
        searchQuery: { reservedById: savedDbUser._id },
        updateParams: { reservedByData: userDependencyData },
        dbServiceAccessOptions,
        updateDbDependencies,
      });
      await this._packageTransactionDbService.updateManyDbDependencies(
        preUpdatePackageTransactions
      );
    }
  };

  protected _initTemplate = async (partialDbServiceInitParams: OptionalUserDbServiceInitParams) => {
    const {
      makeTeacherDbService,
      makePackageDbService,
      makePackageTransactionDbService,
      comparePassword,
    } = partialDbServiceInitParams;
    this._teacherDbService = await makeTeacherDbService;
    this._packageDbService = await makePackageDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._comparePassword = comparePassword;
  };
}

export { UserDbService, JoinedUserDoc };
