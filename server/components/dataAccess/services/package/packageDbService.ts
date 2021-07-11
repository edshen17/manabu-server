import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageDoc } from '../../../../models/Package';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';

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

  public updateManyDbDependencies = async (savedDbPackage?: PackageDoc) => {
    if (savedDbPackage) {
      const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
      const packageDependencyData = await this.findById({
        _id: savedDbPackage._id,
        dbServiceAccessOptions,
      });
      const updateDbDependencies = false;
      const preUpdatePackages = await this._packageTransactionDbService.find({
        searchQuery: { hostedById: savedDbPackage._id },
        dbServiceAccessOptions,
      });
      await this._packageTransactionDbService.updateMany({
        searchQuery: { packageId: savedDbPackage._id },
        updateParams: { packageData: packageDependencyData },
        dbServiceAccessOptions,
        updateDbDependencies,
      });
      await this._packageTransactionDbService.updateManyDbDependencies(preUpdatePackages);
    }
  };

  protected _initTemplate = async (
    partialDbServiceInitParams: OptionalPackageDbServiceInitParams
  ) => {
    const { makePackageTransactionDbService } = partialDbServiceInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
  };
}

export { PackageDbService };
