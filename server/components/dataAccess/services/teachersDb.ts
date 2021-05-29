import { IDbOperations } from '../abstractions/IDbOperations';
import { TeacherDoc } from '../../../models/Teacher';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';

class TeacherDbService extends CommonDbOperations implements IDbOperations {
  private teacherDb: any;
  constructor(props: any) {
    super();
    this.teacherDb = props.teacherDb;
  }

  public findOne = async (searchQuery: {}): Promise<any> => {
    const teacher = await this.teacherDb.findOne(searchQuery).lean().cache({ ttl: 3600 });
    if (teacher) return teacher;
    else throw new Error('Teacher not found.');
  };

  public findByUserId = (userId: string): Promise<any> => {
    const teacher = this.findOne({ userId });
    return teacher;
  };

  public insert = async (modelToInsert: {}): Promise<any> => {
    const result = await this.teacherDb.create(modelToInsert);
    return result;
  };

  public update = async (searchQuery: {}): Promise<any> => {
    const result = await this.teacherDb.create();
    return result;
  };
}

export { TeacherDbService };
