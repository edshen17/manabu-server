import { TeacherDoc } from '../../../../models/Teacher';
import { JoinedUserDoc } from '../../../../models/User';
import {
  AbstractEmbeddedDbService,
  AbstractEmbeddedDbServiceInitParams,
  DB_SERVICE_EMBED_TYPE,
} from '../../abstractions/AbstractEmbeddedDbService';

type OptionalTeacherDbServiceInitParams = {};

type TeacherDbServiceResponse = TeacherDoc | JoinedUserDoc;

class TeacherDbService extends AbstractEmbeddedDbService<
  OptionalTeacherDbServiceInitParams,
  TeacherDbServiceResponse
> {
  protected _initTemplate = async (
    optionalDbServiceInitParams: AbstractEmbeddedDbServiceInitParams<OptionalTeacherDbServiceInitParams>
  ): Promise<void> => {
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

export { TeacherDbService, TeacherDbServiceResponse };
