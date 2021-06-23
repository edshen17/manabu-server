import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations, DefaultDbInitParams } from '../../abstractions/CommonDbOperations';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';

class TeacherBalanceDbService
  extends CommonDbOperations<TeacherBalanceDoc>
  implements IDbOperations<TeacherBalanceDoc, DefaultDbInitParams>
{
  constructor() {
    super();
    this.defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { TeacherBalanceDbService };
