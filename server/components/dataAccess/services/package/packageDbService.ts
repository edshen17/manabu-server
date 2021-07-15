import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageDoc } from '../../../../models/Package';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';

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

  // protected _updateShallowDbDependenciesTemplate = async (props: {
  //   updatedDependencyData: PackageDoc;
  //   dbServiceAccessOptions: DbServiceAccessOptions;
  // }): Promise<void> => {
  //   const dependentPackageTransactions = await this._getPackageDependencies({
  //     ...props,
  //     dependencyDbService: this._packageTransactionDbService,
  //   });
  //   await this._updatePackageDependencies({
  //     ...props,
  //     dependencyDocs: dependentPackageTransactions,
  //     dependencyDbService: this._packageTransactionDbService,
  //   });
  // };

  // private _getPackageDependencies = async (props: {
  //   updatedDependencyData: PackageDoc;
  //   dbServiceAccessOptions: DbServiceAccessOptions;
  //   dependencyDbService: PackageTransactionDbService;
  // }) => {
  //   const { updatedDependencyData, dbServiceAccessOptions, dependencyDbService } = props;
  //   const packageDependencies = await dependencyDbService.find({
  //     searchQuery: { packageId: updatedDependencyData._id },
  //     dbServiceAccessOptions,
  //   });
  //   return packageDependencies;
  // };

  // private _updatePackageDependencies = async (props: {
  //   updatedDependencyData: PackageDoc;
  //   dbServiceAccessOptions: DbServiceAccessOptions;
  //   dependencyDocs: PackageTransactionDoc[];
  //   dependencyDbService: PackageTransactionDbService;
  // }) => {
  //   const { updatedDependencyData, dbServiceAccessOptions, dependencyDocs, dependencyDbService } =
  //     props;
  //   await dependencyDbService.updateMany({
  //     searchQuery: { packageId: updatedDependencyData._id },
  //     updateParams: { packageData: updatedDependencyData },
  //     dbServiceAccessOptions,
  //     isUpdatingDbDependencies: false,
  //   });
  //   await dependencyDbService.updateDbDependencies(dependencyDocs);
  // };

  protected _initTemplate = async (
    partialDbServiceInitParams: OptionalPackageDbServiceInitParams
  ) => {
    const { makePackageTransactionDbService } = partialDbServiceInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
  };
}

export { PackageDbService };
