import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations, DefaultDbInitParams } from '../../abstractions/CommonDbOperations';
import { PackageDoc } from '../../../../models/Package';

class PackageDbService
  extends CommonDbOperations<PackageDoc>
  implements IDbOperations<PackageDoc, DefaultDbInitParams>
{
  constructor() {
    super();
    this.defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageDbService };
