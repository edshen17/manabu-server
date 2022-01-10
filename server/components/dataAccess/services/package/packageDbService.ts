import { PackageDoc } from '../../../../models/Package';
import { JoinedUserDoc } from '../../../../models/User';
import {
  AbstractEmbeddedDbService,
  AbstractEmbeddedDbServiceInitParams,
  DB_SERVICE_EMBED_TYPE,
} from '../../abstractions/AbstractEmbeddedDbService';

type OptionalPackageDbServiceInitParams = {};

type PackageDbServiceResponse = PackageDoc | JoinedUserDoc;

class PackageDbService extends AbstractEmbeddedDbService<
  OptionalPackageDbServiceInitParams,
  PackageDbServiceResponse
> {
  protected _initTemplate = async (
    optionalDbServiceInitParams: AbstractEmbeddedDbServiceInitParams<OptionalPackageDbServiceInitParams>
  ): Promise<void> => {
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
