import { IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';

type TeacherBalanceDbServiceInitParams = {};

class TeacherBalanceDbService
  extends AbstractDbService<TeacherBalanceDbServiceInitParams, TeacherBalanceDoc>
  implements IDbService<TeacherBalanceDbServiceInitParams, TeacherBalanceDoc>
{
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }
}

export { TeacherBalanceDbService };
