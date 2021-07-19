import { TeacherDoc } from '../../../../models/Teacher';
import {
  AbstractEmbeddedDbService,
  AbstractEmbeddedDbServiceInitParams,
  DB_SERVICE_EMBED_TYPE,
} from '../../abstractions/AbstractEmbeddedDbService';

type OptionalTeacherDbServiceInitParams = {};

class TeacherDbService extends AbstractEmbeddedDbService<
  OptionalTeacherDbServiceInitParams,
  TeacherDoc
> {
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
      adminView: {},
      selfView: {},
      overrideView: {},
    };
  }
  protected _initTemplate = async (
    optionalDbServiceInitParams: AbstractEmbeddedDbServiceInitParams<OptionalTeacherDbServiceInitParams>
  ) => {
    const { makeParentDbService, deepEqual } = optionalDbServiceInitParams;
    this._parentDbService = await makeParentDbService;
    this._deepEqual = deepEqual;
    this._embeddedFieldData = {
      parentFieldName: 'teacherData',
      childFieldName: 'packages',
      embedType: DB_SERVICE_EMBED_TYPE.SINGLE,
    };
  };
}

export { TeacherDbService };
