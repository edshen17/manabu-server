import { PackageDoc } from '../../../../models/Package';
import { JoinedUserDoc } from '../../../../models/User';
import {
  AbstractEmbeddedDbService,
  AbstractEmbeddedDbServiceInitParams,
  DB_SERVICE_EMBED_TYPE,
} from '../../abstractions/AbstractEmbeddedDbService';
import { DB_SERVICE_COLLECTIONS } from '../../abstractions/IDbService';

type OptionalPackageDbServiceInitParams = {};

type PackageDbServiceResponse = PackageDoc | JoinedUserDoc;

class PackageDbService extends AbstractEmbeddedDbService<
  OptionalPackageDbServiceInitParams,
  PackageDbServiceResponse
> {
  protected _getCacheDependencies = (): string[] => {
    return [
      DB_SERVICE_COLLECTIONS.USERS,
      DB_SERVICE_COLLECTIONS.PACKAGE_TRANSACTIONS,
      DB_SERVICE_COLLECTIONS.APPOINTMENTS,
      DB_SERVICE_COLLECTIONS.TEACHERS,
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

export { PackageDbService, PackageDbServiceResponse };
