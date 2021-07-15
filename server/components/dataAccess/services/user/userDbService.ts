import { DbServiceAccessOptions, DbServiceParams } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDbService } from '../teacher/teacherDbService';
import { PackageDbService } from '../package/packageDbService';
import { TeacherDoc } from '../../../../models/Teacher';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { MinuteBankDbService } from '../minuteBank/minuteBankDbService';
import { JoinedUserDoc, UserDoc } from '../../../../models/User';

type OptionalUserDbServiceInitParams = {
  makeTeacherDbService: Promise<TeacherDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
  comparePassword: any;
};

class UserDbService extends AbstractDbService<OptionalUserDbServiceInitParams, JoinedUserDoc> {
  private _teacherDbService!: TeacherDbService;
  private _packageDbService!: PackageDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _minuteBankDbService!: MinuteBankDbService;
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
    const isArray = Array.isArray(userData);
    if (!userData) {
      return;
    }
    if (isArray) {
      const joinedUserPromises = userData.map(async (user: UserDoc) => {
        return await this._joinUserTeacherPackage(user, dbServiceAccessOptions);
      });
      return await Promise.all(joinedUserPromises);
    } else {
      return await this._joinUserTeacherPackage(userData, dbServiceAccessOptions);
    }
  };

  private _joinUserTeacherPackage = async (
    userData: UserDoc,
    dbServiceAccessOptions: DbServiceAccessOptions
  ): Promise<JoinedUserDoc> => {
    const joinedUserDoc: any = this._cloneDeep(userData);
    const userId: string = userData._id;
    const teacherData: TeacherDoc = await this._teacherDbService.findById({
      _id: userId,
      dbServiceAccessOptions,
    });

    const packages = await this._packageDbService.find({
      searchQuery: { hostedById: userId },
      dbServiceAccessOptions,
    });

    if (teacherData) {
      joinedUserDoc.teacherData = teacherData;
      joinedUserDoc.teacherData.packages = packages;
    }

    return joinedUserDoc;
  };

  protected _updateDbDependencyControllerTemplate = async (props: {
    updatedDependeeDocs: JoinedUserDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { updatedDependeeDocs } = props;
    const toUpdateDependentPromises: Promise<any>[] = [];
    for (const updatedJoinedUserDoc of updatedDependeeDocs) {
      const toUpdatePackageTransactionPromises = this._getToUpdateDependeePromises({
        ...props,
        updatedJoinedUserDoc,
        dependencyDbService: this._packageTransactionDbService,
      });
      // const toUpdateMinuteBankPromises = this._getToUpdateDependeePromises({
      //   ...props,
      //   updatedJoinedUserDoc,
      //   dependencyDbService: this._minuteBankDbService,
      // });
      toUpdateDependentPromises.push(
        ...toUpdatePackageTransactionPromises
        // ...toUpdateMinuteBankPromises
      );
    }
    return toUpdateDependentPromises;
  };

  private _getToUpdateDependeePromises = (props: {
    updatedJoinedUserDoc: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: PackageTransactionDbService | MinuteBankDbService;
  }): Promise<any>[] => {
    const { updatedJoinedUserDoc, dbServiceAccessOptions, dependencyDbService } = props;
    console.log(updatedJoinedUserDoc, 'here');
    const packageTransactionHostedBySearchQuery = { hostedById: updatedJoinedUserDoc._id };
    const toUpdatePackageTransactionHostedByPromises = dependencyDbService.updateMany({
      searchQuery: packageTransactionHostedBySearchQuery,
      updateParams: { hostedByData: updatedJoinedUserDoc },
      dbServiceAccessOptions,
      dbDependencyUpdateParams: {
        updatedDocSearchQuery: packageTransactionHostedBySearchQuery,
      },
    });
    const packageTransactionReservedBySearchQuery = { reservedById: updatedJoinedUserDoc._id };
    const toUpdatePackageTransactionReservedByPromises = dependencyDbService.updateMany({
      searchQuery: packageTransactionReservedBySearchQuery,
      updateParams: { reservedByData: updatedJoinedUserDoc },
      dbServiceAccessOptions,
      dbDependencyUpdateParams: {
        updatedDocSearchQuery: packageTransactionReservedBySearchQuery,
      },
    });
    return [
      toUpdatePackageTransactionHostedByPromises,
      toUpdatePackageTransactionReservedByPromises,
    ];
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

export { UserDbService };
