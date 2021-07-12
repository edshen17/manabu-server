import {
  DbServiceAccessOptions,
  DbServiceParams,
  IDbService,
  UPDATE_DB_DEPENDENCY_MODE,
} from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDbService } from '../teacher/teacherDbService';
import { PackageDbService } from '../package/packageDbService';
import { UserDoc } from '../../../../models/User';
import { TeacherDoc } from '../../../../models/Teacher';
import { PackageDoc } from '../../../../models/Package';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { MinuteBankDbService } from '../minuteBank/minuteBankDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';

type OptionalUserDbServiceInitParams = {
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
  comparePassword: any;
};
type JoinedTeacherDoc = TeacherDoc & { packages: [PackageDoc] };
type JoinedUserDoc = UserDoc & { teacherAppPending: boolean; teacherData: JoinedTeacherDoc };

class UserDbService extends AbstractDbService<OptionalUserDbServiceInitParams, JoinedUserDoc> {
  private _teacherDbService!: TeacherDbService;
  private _packageDbService!: PackageDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _minuteBankDbService!: MinuteBankDbService;
  protected _updateDbDependencyMode: string = UPDATE_DB_DEPENDENCY_MODE.SHALLOW;
  private _comparePassword!: any;

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

  protected _dbQueryReturnTemplate = async (
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
    const userData = await this._executeQuery(dbServiceAccessOptions, asyncCallback);
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

  protected _updateShallowDbDependenciesTemplate = async (props: {
    updatedDependencyData: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const dependentPackageTransactions = await this._getUserDependencies({
      ...props,
      dependencyDbService: this._packageTransactionDbService,
    });
    // const dependentMinuteBanks = await this._getUserDependencies({
    //   ...props,
    //   dependencyDbService: this._minuteBankDbService,
    // });
    await this._updateUserDependencies({
      ...props,
      dependencyDocs: dependentPackageTransactions,
      dependencyDbService: this._packageTransactionDbService,
    });
    // await this._updateUserDependencies({
    //   ...props,
    //   dependencyDocs: dependentMinuteBanks,
    //   dependencyDbService: this._minuteBankDbService,
    // });
  };

  private _getUserDependencies = async (props: {
    updatedDependencyData: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: IDbService<any, any>;
  }) => {
    const { updatedDependencyData, dbServiceAccessOptions, dependencyDbService } = props;
    const hostedByDependencies = await dependencyDbService.find({
      searchQuery: { hostedById: updatedDependencyData._id },
      dbServiceAccessOptions,
    });
    const reservedByDependencies = await dependencyDbService.find({
      searchQuery: { reservedById: updatedDependencyData._id },
      dbServiceAccessOptions,
    });
    const userDependencies = [hostedByDependencies, reservedByDependencies].flat();
    return userDependencies;
  };

  private _updateUserDependencies = async (props: {
    updatedDependencyData: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDocs: PackageTransactionDoc[];
    dependencyDbService: IDbService<any, any>;
  }) => {
    const { updatedDependencyData, dbServiceAccessOptions, dependencyDocs, dependencyDbService } =
      props;
    await dependencyDbService.updateMany({
      searchQuery: { hostedById: updatedDependencyData._id },
      updateParams: { hostedByData: updatedDependencyData },
      dbServiceAccessOptions,
      isUpdatingDbDependencies: false,
    });
    await dependencyDbService.updateMany({
      searchQuery: { reservedById: updatedDependencyData._id },
      updateParams: { reservedByData: updatedDependencyData },
      dbServiceAccessOptions,
      isUpdatingDbDependencies: false,
    });
    await dependencyDbService.updateDbDependencies(dependencyDocs);
  };

  protected _initTemplate = async (partialDbServiceInitParams: OptionalUserDbServiceInitParams) => {
    const {
      makeTeacherDbService,
      makePackageDbService,
      makePackageTransactionDbService,
      makeMinuteBankDbService,
      comparePassword,
    } = partialDbServiceInitParams;
    this._teacherDbService = await makeTeacherDbService;
    this._packageDbService = await makePackageDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._minuteBankDbService = await makeMinuteBankDbService;
    this._comparePassword = comparePassword;
  };
}

export { UserDbService, JoinedUserDoc };
