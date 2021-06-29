import { IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';

type PartialPackageTransactionDbServiceInitParams = {};

class PackageTransactionDbService
  extends AbstractDbService<PartialPackageTransactionDbServiceInitParams, PackageTransactionDoc>
  implements IDbService<PartialPackageTransactionDbServiceInitParams, PackageTransactionDoc>
{
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }
}

export { PackageTransactionDbService };
