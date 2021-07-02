import { DbServiceAccessOptions, DbServiceParams, IDbService } from '../../abstractions/IDbService';
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

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbDataPromise = this.findOne({ searchQuery: { userId: _id }, dbServiceAccessOptions });
    const dbData = await this._grantAccess(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbDataPromise = this._dbModel.findOneAndDelete({ userId: _id }).lean();
    const dbData = await this._dbDataReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };
}

export { TeacherDbService };
