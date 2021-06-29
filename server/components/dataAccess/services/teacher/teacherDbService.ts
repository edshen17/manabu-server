import { DbServiceParams, IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDoc } from '../../../../models/Teacher';

type TeacherDbServiceInitParams = {};

class TeacherDbService
  extends AbstractDbService<TeacherDbServiceInitParams, TeacherDoc>
  implements IDbService<TeacherDbServiceInitParams, TeacherDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {
        licensePath: 0,
      },
      adminSettings: {},
      isSelfSettings: {},
    };
  }

  public findById = async (dbServiceParams: DbServiceParams): Promise<TeacherDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const asyncCallback = this.findOne({ searchQuery: { userId: _id }, dbServiceAccessOptions });
    return await this._grantAccess(dbServiceAccessOptions, asyncCallback);
  };
}

export { TeacherDbService };
