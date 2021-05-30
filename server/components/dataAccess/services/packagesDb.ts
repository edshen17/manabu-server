import { IDbOperations } from '../abstractions/IDbOperations';
import { PackageDoc } from '../../../models/Package';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';

class PackageDbService extends CommonDbOperations implements IDbOperations {
  constructor(props: any) {
    super(props.packageDb);
  }
}

export { PackageDbService };
