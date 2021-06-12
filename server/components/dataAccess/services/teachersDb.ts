import { DbParams, IDbOperations } from '../abstractions/IDbOperations';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';
import { TeacherDoc } from '../../../models/Teacher';

class TeacherDbService extends CommonDbOperations<TeacherDoc> implements IDbOperations<TeacherDoc> {
  constructor(props: { teacherDb: any }) {
    super(props.teacherDb);
    this.defaultSelectOptions = {
      defaultSettings: {
        licensePath: 0,
      },
      adminSettings: {},
      isSelfSettings: {},
    };
  }

  public findById = async (params: DbParams): Promise<TeacherDoc> => {
    const { _id, accessOptions } = params;
    const asyncCallback = this.findOne({ searchQuery: { userId: _id }, accessOptions });
    return await this._grantAccess(accessOptions, asyncCallback);
  };
}

export { TeacherDbService };
