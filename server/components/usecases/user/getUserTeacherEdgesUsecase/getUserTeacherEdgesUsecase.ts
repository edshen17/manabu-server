import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetUserTeacherEdgesUsecaseInitParams = {
  makeCacheDbService: Promise<CacheDbService>;
};
type GetUserTeacherEdgesUsecaseResponse = { users: JoinedUserDoc[] };

class GetUserTeacherEdgesUsecase extends AbstractGetUsecase<
  OptionalGetUserTeacherEdgesUsecaseInitParams,
  GetUserTeacherEdgesUsecaseResponse,
  UserDbServiceResponse
> {
  private _cacheDbService!: CacheDbService;

  protected _isProtectedResource = (): boolean => {
    return true;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetUserTeacherEdgesUsecaseResponse> => {
    const { dbServiceAccessOptions } = props;
    const graphQuery = await this._getGraphQuery(props);
    const res = await this._cacheDbService.graphQuery({
      query: graphQuery,
      dbServiceAccessOptions,
    });
    const promiseArr = [];
    while (res.hasNext()) {
      const record = res.next();
      const userNodes = record.values();
      for (const userNode of userNodes) {
        const user = userNode.properties;
        const promise = this._dbService.findById({
          _id: user._id,
          dbServiceAccessOptions: this._dbService.getBaseDbServiceAccessOptions(),
        });
        promiseArr.push(promise);
      }
    }
    const users = await Promise.all(promiseArr);
    return { users };
  };

  private _getGraphQuery = async (props: MakeRequestTemplateParams): Promise<string> => {
    const { currentAPIUser, endpointPath, params, query } = props;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const _id = isSelf ? currentAPIUser.userId : params.userId;
    const isTeacher = ['teacher', 'admin'].includes(currentAPIUser.role);
    const { page, limit } = this._getProcessedQuery(query);
    const intermediateGraphQuery = isTeacher
      ? `MATCH (teacher:User { _id: "${_id}"  })-[teaches:teaches]->(students:User) RETURN students ORDER BY teaches.since`
      : `MATCH (student:User { _id: "${_id}"  })<-[teaches:teaches]-(teachers:User) RETURN teachers ORDER BY teaches.since`;
    const finalGraphQuery = `${intermediateGraphQuery} SKIP ${page} LIMIT ${limit}`;
    return finalGraphQuery;
  };

  private _getProcessedQuery = (query: StringKeyObject): StringKeyObject => {
    const { page, limit } = query;
    const processedQuery = {
      page: page || 0,
      limit: limit || 5,
    };
    return processedQuery;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetUserTeacherEdgesUsecaseInitParams
  ): Promise<void> => {
    const { makeCacheDbService } = optionalInitParams;
    this._cacheDbService = await makeCacheDbService;
  };
}

export { GetUserTeacherEdgesUsecase, GetUserTeacherEdgesUsecaseResponse };
