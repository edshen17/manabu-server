import { PackageDoc } from '../../../../models/Package';
import {
  AbstractEmbeddedDbService,
  AbstractEmbeddedDbServiceInitParams,
  DB_SERVICE_EMBED_TYPE,
} from '../../abstractions/AbstractEmbeddedDbService';
import { DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS } from '../../abstractions/IDbService';

type OptionalPackageDbServiceInitParams = {};

class PackageDbService extends AbstractEmbeddedDbService<
  OptionalPackageDbServiceInitParams,
  PackageDoc
> {
  protected _getCacheDependencies = (): string[] => {
    return [
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.USERS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.PACKAGE_TRANSACTIONS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.MINUTE_BANKS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.APPOINTMENTS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.TEACHERS,
    ];
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: AbstractEmbeddedDbServiceInitParams<OptionalPackageDbServiceInitParams>
  ) => {
    const { makeParentDbService, deepEqual } = optionalDbServiceInitParams;
    this._parentDbService = await makeParentDbService;
    this._deepEqual = deepEqual;
    this._embeddedFieldData = {
      parentFieldName: 'packages',
      embedType: DB_SERVICE_EMBED_TYPE.MULTI,
    };
  };
}

export { PackageDbService };
