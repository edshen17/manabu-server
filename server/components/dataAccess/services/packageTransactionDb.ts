import { IDbOperations } from '../abstractions/IDbOperations';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';
import { PackageDoc } from '../../../models/Package';

class PackageTransactionDbService
  extends CommonDbOperations<PackageDoc>
  implements IDbOperations<PackageDoc>
{
  constructor(props: { packageTransactionDb: any }) {
    super(props.packageTransactionDb);
    this.defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { PackageTransactionDbService };
