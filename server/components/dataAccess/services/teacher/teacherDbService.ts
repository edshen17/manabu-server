import { DbServiceParams, IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDoc } from '../../../../models/Teacher';

type PartialTeacherDbServiceInitParams = {};

class TeacherDbService
  extends AbstractDbService<PartialTeacherDbServiceInitParams, TeacherDoc>
  implements IDbService<PartialTeacherDbServiceInitParams, TeacherDoc>
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
