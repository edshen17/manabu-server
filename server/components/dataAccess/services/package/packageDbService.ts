import { PackageDoc } from '../../../../models/Package';
import {
  AbstractEmbeddedDbService,
  AbstractEmbeddedDbServiceInitParams,
  DB_SERVICE_EMBED_TYPE,
} from '../../abstractions/AbstractEmbeddedDbService';
import { DbServiceAccessOptions, IDbService } from '../../abstractions/IDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';

type OptionalPackageDbServiceInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

class PackageDbService extends AbstractEmbeddedDbService<
  OptionalPackageDbServiceInitParams,
  PackageDoc
> {
  private _packageTransactionDbService!: PackageTransactionDbService;
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
      adminView: {},
      selfView: {},
      overrideView: {},
    };
  }

  protected _updateDbDependenciesTemplate = async (props: {
    updateDependentPromises: Promise<any>[];
    updatedDependeeDoc: PackageDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { updateDependentPromises, ...getUpdateDependeePromisesProps } = props;
    const updatePackageTransactionPromises = await this._getUpdateManyDependentPromises({
      ...getUpdateDependeePromisesProps,
      dependencyDbService: this._packageTransactionDbService,
    });
    updateDependentPromises.push(...updatePackageTransactionPromises);
  };

  protected _getUpdateManyDependentPromises = async (props: {
    updatedDependeeDoc: PackageDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: IDbService<any, any>;
  }): Promise<Promise<any>[]> => {
    const { updatedDependeeDoc, dbServiceAccessOptions, dependencyDbService } = props;
    const updateManyPackageTransactionPromise = this._getUpdateManyDependentPromise({
      searchQuery: { packageId: updatedDependeeDoc._id },
      updateQuery: {
        packageData: updatedDependeeDoc,
      },
      dbServiceAccessOptions,
      dependencyDbService,
    });
    return [updateManyPackageTransactionPromise];
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: AbstractEmbeddedDbServiceInitParams<OptionalPackageDbServiceInitParams>
  ) => {
    const { makeParentDbService, deepEqual, makePackageTransactionDbService } =
      optionalDbServiceInitParams;
    this._parentDbService = await makeParentDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._deepEqual = deepEqual;
    this._embeddedFieldData = {
      parentFieldName: 'packages',
      embedType: DB_SERVICE_EMBED_TYPE.MULTI,
    };
  };
}

export { PackageDbService };
