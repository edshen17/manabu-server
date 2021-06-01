import { IDbOperations } from '../abstractions/IDbOperations';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';
import { PackageDoc } from '../../../models/Package';

class PackageDbService extends CommonDbOperations<PackageDoc> implements IDbOperations<PackageDoc> {
  constructor(props: any) {
    super(props.packageDb, {
      defaultSettings: {},
    });
  }
}

export { PackageDbService };
