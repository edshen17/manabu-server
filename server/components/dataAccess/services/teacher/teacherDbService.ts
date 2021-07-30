import { TeacherDoc } from '../../../../models/Teacher';
import { JoinedUserDoc } from '../../../../models/User';
import {
  AbstractEmbeddedDbService,
  AbstractEmbeddedDbServiceInitParams,
  DB_SERVICE_EMBED_TYPE,
} from '../../abstractions/AbstractEmbeddedDbService';
import { DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS } from '../../abstractions/IDbService';

type OptionalTeacherDbServiceInitParams = {};

class TeacherDbService extends AbstractEmbeddedDbService<
  OptionalTeacherDbServiceInitParams,
  TeacherDoc | JoinedUserDoc
> {
  protected _getCacheDependencies = (): string[] => {
    return [
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.USERS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.PACKAGE_TRANSACTIONS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.MINUTE_BANKS,
    ];
  };

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
