import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageDoc } from '../../../../models/Package';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { DbServiceAccessOptions, IDbService } from '../../abstractions/IDbService';

type OptionalPackageDbServiceInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

class PackageDbService extends AbstractDbService<OptionalPackageDbServiceInitParams, PackageDoc> {
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }

  private _packageTransactionDbService!: PackageTransactionDbService;

  protected _updateDbDependencyControllerTemplate = async (props: {
    updateDependentPromises: Promise<any>[];
    updatedDependeeDoc: PackageDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { updateDependentPromises, ...getUpdateDependeePromisesProps } = props;
    const updateAppointmentPromises = await this._getUpdateManyDependeePromises({
      ...getUpdateDependeePromisesProps,
      dependencyDbService: this._packageTransactionDbService,
    });
    updateDependentPromises.push(...updateAppointmentPromises);
  };

  protected _getUpdateManyDependeePromises = async (props: {
    updatedDependeeDoc: PackageDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: IDbService<any, any>;
  }): Promise<Promise<any>[]> => {
    const { updatedDependeeDoc, dbServiceAccessOptions, dependencyDbService } = props;
    const updateManyPackageTransactionPromise = this._getUpdateManyDependeePromise({
      searchQuery: { packageId: updatedDependeeDoc._id },
      updateParams: {
        packageData: updatedDependeeDoc,
      },
      dbServiceAccessOptions,
      dependencyDbService,
    });
    return [updateManyPackageTransactionPromise];
  };

  protected _initTemplate = async (
    partialDbServiceInitParams: OptionalPackageDbServiceInitParams
  ) => {
    const { makePackageTransactionDbService } = partialDbServiceInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
  };
}

export { PackageDbService };
