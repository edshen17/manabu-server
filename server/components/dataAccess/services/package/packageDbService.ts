import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations } from '../../abstractions/AbstractDbOperations';
import { PackageDoc } from '../../../../models/Package';

class PackageDbService extends CommonDbOperations<PackageDoc> implements IDbOperations<PackageDoc> {
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageDbService };
