import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations, DefaultDbInitParams } from '../../abstractions/CommonDbOperations';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';

class PackageTransactionDbService
  extends CommonDbOperations<PackageTransactionDoc>
  implements IDbOperations<PackageTransactionDoc, DefaultDbInitParams>
{
  constructor() {
    super();
    this.defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageTransactionDbService };
