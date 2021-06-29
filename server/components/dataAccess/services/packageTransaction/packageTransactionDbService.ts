import { IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';

type PackageTransactionDbServiceInitParams = {};

class PackageTransactionDbService
  extends AbstractDbService<PackageTransactionDbServiceInitParams, PackageTransactionDoc>
  implements IDbService<PackageTransactionDbServiceInitParams, PackageTransactionDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageTransactionDbService };
