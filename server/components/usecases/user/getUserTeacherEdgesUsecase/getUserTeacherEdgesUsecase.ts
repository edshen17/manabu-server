import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetUserTeacherEdgesUsecaseInitParams = {
  makeGraphDbService: Promise<GraphDbService>;
};
type GetUserTeacherEdgesUsecaseResponse = { users: JoinedUserDoc[]; pages: number };

class GetUserTeacherEdgesUsecase extends AbstractGetUsecase<
  OptionalGetUserTeacherEdgesUsecaseInitParams,
  GetUserTeacherEdgesUsecaseResponse,
  UserDbServiceResponse
> {
  private _graphDbService!: GraphDbService;

  protected _isProtectedResource = (): boolean => {
    return true;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetUserTeacherEdgesUsecaseResponse> => {
    const { dbServiceAccessOptions } = props;
    const { graphQuery, limit } = await this._getGraphQuery(props);
    const res = await this._graphDbService.graphQuery({
      query: graphQuery,
      dbServiceAccessOptions,
    });
    const promiseArr = [];
    let count = 0;
    while (res.hasNext()) {
      const record = res.next();
      const values = record.values();
      for (const value of values) {
        const user = value.properties;
        if (user) {
          const promise = this._dbService.findById({
            _id: user._id,
            dbServiceAccessOptions,
          });
          promiseArr.push(promise);
        } else {
          count = value;
        }
      }
    }
    const users = await Promise.all(promiseArr);
    const pages = Math.ceil(count / limit) - 1;
    return { users, pages };
  };

  private _getGraphQuery = async (props: MakeRequestTemplateParams) => {
    const { currentAPIUser, endpointPath, params, query } = props;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const _id = isSelf ? currentAPIUser.userId : params.userId;
    const isTeacher = ['teacher', 'admin'].includes(currentAPIUser.role);
    const { page, limit } = this._getProcessedQuery(query);
    const intermediateGraphQuery = isTeacher
      ? `MATCH (teacher:User { _id: "${_id}"  })-[teaches:teaches]->(students:User) RETURN students, count(*) ORDER BY teaches.since`
      : `MATCH (student:User { _id: "${_id}"  })<-[teaches:teaches]-(teachers:User) RETURN teachers, count(*) ORDER BY teaches.since`;
    const graphQuery = `${intermediateGraphQuery} SKIP ${page} LIMIT ${limit}`;
    return { graphQuery, limit, page };
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
    const { makeGraphDbService } = optionalInitParams;
    this._graphDbService = await makeGraphDbService;
  };
}

export { GetUserTeacherEdgesUsecase, GetUserTeacherEdgesUsecaseResponse };
