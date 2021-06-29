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
    this._dbModelViews = {
      defaultView: {
        licensePath: 0,
      },
      adminView: {},
      selfView: {},
    };
  }

  public findById = async (dbServiceParams: DbServiceParams): Promise<TeacherDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbDataPromise = this.findOne({ searchQuery: { userId: _id }, dbServiceAccessOptions });
    const dbData = await this._grantAccess(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };
}

export { TeacherDbService };
