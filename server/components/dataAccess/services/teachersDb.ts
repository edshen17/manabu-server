import { IDbOperations } from '../abstractions/IDbOperations';
import { TeacherDoc } from '../../../models/Teacher';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';

class TeacherDbService extends CommonDbOperations implements IDbOperations {
  private teacherDb: any;
  constructor(teacherDb: any, cacheService: any) {
    super(cacheService);
    this.teacherDb = teacherDb;
  }

  public findOne = async (searchQuery: {}): Promise<TeacherDoc | Error> => {
    const teacher = await this.teacherDb.findOne(searchQuery).lean().cache();
    if (teacher) return teacher;
    else throw new Error('Teacher not found.');
  };

  public findByUserId = (userId: string): Promise<TeacherDoc | Error> => {
    const teacher = this.findOne({ userId });
    return teacher;
  };

  public insert = async (modelToInsert: {}): Promise<TeacherDoc | Error> => {
    const result = await this.teacherDb.create(modelToInsert);
    return result;
  };

  public update = async (searchQuery: {}): Promise<TeacherDoc | Error> => {
    const result = await this.teacherDb.create();
    return result;
  };
}

export { TeacherDbService };
