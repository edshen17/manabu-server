import { IDbOperations } from '../abstractions/IDbOperations';
import { TeacherDoc } from '../../../models/Teacher';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';

class TeacherDbService extends CommonDbOperations implements IDbOperations {
  constructor(props: any) {
    super(props.teacherDb);
  }
}

export { TeacherDbService };
