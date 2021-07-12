import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDoc } from '../../../../models/Teacher';

type OptionalTeacherDbServiceInitParams = {};

class TeacherDbService extends AbstractDbService<OptionalTeacherDbServiceInitParams, TeacherDoc> {
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {
        licensePathUrl: 0,
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
    const dbData = await this._executeQuery(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbDataPromise = this._dbModel.findOneAndDelete({ userId: _id }).lean();
    const dbData = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbDataPromise);
    return dbData;
  };
}

export { TeacherDbService };
