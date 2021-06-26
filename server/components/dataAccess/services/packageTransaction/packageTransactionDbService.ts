import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations } from '../../abstractions/AbstractDbOperations';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';

class PackageTransactionDbService
  extends CommonDbOperations<PackageTransactionDoc>
  implements IDbOperations<PackageTransactionDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageTransactionDbService };
