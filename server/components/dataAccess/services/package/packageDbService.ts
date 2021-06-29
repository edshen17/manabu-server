import { IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageDoc } from '../../../../models/Package';

type PackageDbServiceInitParams = {};

class PackageDbService
  extends AbstractDbService<PackageDbServiceInitParams, PackageDoc>
  implements IDbService<PackageDbServiceInitParams, PackageDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageDbService };
