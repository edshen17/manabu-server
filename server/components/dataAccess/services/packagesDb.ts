import { IDbOperations } from '../abstractions/IDbOperations';
import { PackageDoc } from '../../../models/Package';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';

class PackageDbService extends CommonDbOperations implements IDbOperations {
  private packageDb: any;
  constructor(props: any) {
    super();
    this.packageDb = props.packageDb;
  }

  public findOne = async (searchQuery: {}): Promise<any> => {
    const teacher = await this.packageDb.findOne(searchQuery).lean().cache();
    if (teacher) return teacher;
    else throw new Error('Teacher not found.');
  };

  public findByUserId = (userId: string): Promise<any> => {
    const teacher = this.findOne({ userId });
    return teacher;
  };

  public insert = async (modelToInsert: {}): Promise<any> => {
    const result = await this.packageDb.create(modelToInsert);
    return result;
  };

  public update = async (searchQuery: {}): Promise<any> => {
    const result = await this.packageDb.create();
    return result;
  };
}

export { PackageDbService };
