import { IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageDoc } from '../../../../models/Package';

type PartialPackageDbServiceInitParams = {};

class PackageDbService
  extends AbstractDbService<PartialPackageDbServiceInitParams, PackageDoc>
  implements IDbService<PartialPackageDbServiceInitParams, PackageDoc>
{
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }
}

export { PackageDbService };
