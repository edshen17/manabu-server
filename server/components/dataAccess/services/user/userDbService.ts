import { DbServiceAccessOptions, DbServiceParams, IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { MinuteBankDbService } from '../minuteBank/minuteBankDbService';
import { JoinedUserDoc } from '../../../../models/User';

type OptionalUserDbServiceInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
  comparePassword: any;
};

class UserDbService extends AbstractDbService<OptionalUserDbServiceInitParams, JoinedUserDoc> {
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
        'teacherData.licensePathUrl': 0,
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

  protected _updateDbDependenciesTemplate = async (props: {
    updateDependentPromises: Promise<any>[];
    updatedDependeeDoc: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { updateDependentPromises, ...getUpdateDependeePromisesProps } = props;
    const updatePackageTransactionPromises = await this._getUpdateManyDependentPromises({
      ...getUpdateDependeePromisesProps,
      dependencyDbService: this._packageTransactionDbService,
    });
    const updateMinuteBankPromises = await this._getUpdateManyDependentPromises({
      ...getUpdateDependeePromisesProps,
      dependencyDbService: this._minuteBankDbService,
    });
    updateDependentPromises.push(...updatePackageTransactionPromises, ...updateMinuteBankPromises);
  };

  protected _getUpdateManyDependentPromises = async (props: {
    updatedDependeeDoc: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: IDbService<any, any>;
  }): Promise<Promise<any>[]> => {
    const { updatedDependeeDoc, dbServiceAccessOptions, dependencyDbService } = props;
    const updatedDependeeHostedBySearchQuery = { hostedById: updatedDependeeDoc._id };
    const updateManyDependentHostedByPromise = this._getUpdateManyDependentPromise({
      searchQuery: updatedDependeeHostedBySearchQuery,
      updateQuery: { hostedByData: updatedDependeeDoc },
      dbServiceAccessOptions,
      dependencyDbService,
      updatedDependeeSearchQuery: updatedDependeeHostedBySearchQuery,
    });
    const updatedDependeeReservedBySearchQuery = { reservedById: updatedDependeeDoc._id };
    const updateManyDependentReservedByPromise = this._getUpdateManyDependentPromise({
      searchQuery: updatedDependeeReservedBySearchQuery,
      updateQuery: { reservedByData: updatedDependeeDoc },
      dbServiceAccessOptions,
      dependencyDbService,
      updatedDependeeSearchQuery: updatedDependeeReservedBySearchQuery,
    });
    const updateManyDependeePromises = [
      updateManyDependentHostedByPromise,
      updateManyDependentReservedByPromise,
    ];
    return updateManyDependeePromises;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalUserDbServiceInitParams
  ) => {
    const { makePackageTransactionDbService, makeMinuteBankDbService, comparePassword } =
      optionalDbServiceInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._minuteBankDbService = await makeMinuteBankDbService;
    this._comparePassword = comparePassword;
  };
}

export { UserDbService };
