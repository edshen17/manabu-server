import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations } from '../../abstractions/CommonDbOperations';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';

class TeacherBalanceDbService
  extends CommonDbOperations<TeacherBalanceDoc>
  implements IDbOperations<TeacherBalanceDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { TeacherBalanceDbService };
