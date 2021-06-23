import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations } from '../../abstractions/CommonDbOperations';
import { PackageDoc } from '../../../../models/Package';

class PackageDbService extends CommonDbOperations<PackageDoc> implements IDbOperations<PackageDoc> {
  constructor() {
    super();
    this.defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageDbService };
