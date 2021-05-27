import { IDbOperations } from '../abstractions/IDbOperations';
import { PackageDoc } from '../../../models/Package';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';

class PackagesDbService<DbType>
  extends CommonDbOperations<DbType>
  implements IDbOperations<DbType>
{
  private packageDb: any;
  constructor(packageDb: any, cacheService: any) {
    super(cacheService);
    this.packageDb = packageDb;
  }

  public findOne = async (searchQuery: {}): Promise<PackageDoc | Error> => {
    const teacher = await this.packageDb.findOne(searchQuery).lean().cache();
    if (teacher) return teacher;
    else throw new Error('Teacher not found.');
  };

  public findByUserId = (userId: string): Promise<PackageDoc | Error> => {
    const teacher = this.findOne({ userId });
    return teacher;
  };

  public insert = async (modelToInsert: {}): Promise<PackageDoc | Error> => {
    const result = await this.packageDb.create(modelToInsert);
    return result;
  };

  public update = async (searchQuery: {}): Promise<PackageDoc | Error> => {
    const result = await this.packageDb.create();
    return result;
  };
}

export { PackagesDbService };
