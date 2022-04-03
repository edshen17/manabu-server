import { ContentDoc } from '../../../../models/Content';
import { StringKeyObject } from '../../../../types/custom';
import { ContentDbServiceResponse } from '../../../dataAccess/services/content/contentDbService';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetContentsUsecaseInitParams = {
  makeGraphDbService: Promise<GraphDbService>;
};
type GetContentsUsecaseResponse = { contents: ContentDoc[]; pages: number };

class GetContentsUsecase extends AbstractGetUsecase<
  OptionalGetContentsUsecaseInitParams,
  GetContentsUsecaseResponse,
  ContentDbServiceResponse
> {
  private _graphDbService!: GraphDbService;

  // do not decode content to avoid sending bulky json
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetContentsUsecaseResponse> => {
    const { query } = props;
    const { page, limit } = this._getProcessedQuery(query);
    const { currentAPIUser, dbServiceAccessOptions } = props;
    const contents = await this._dbService.find({
      searchQuery: {},
      dbServiceAccessOptions,
      paginationOptions: {
        page,
        limit,
        sort: {},
      },
    });
    const pages = 10;
    // const { graphQuery, limit } = await this._getGraphQuery(props);
    // const res = await this._graphDbService.graphQuery({
    //   query: graphQuery,
    //   dbServiceAccessOptions,
    // });
    // const promiseArr: ContentDoc[] = [];
    // const count = 0;
    // while (res.hasNext()) {
    //   const record = res.next();
    //   const values = record.values();
    //   console.log(record, values);
    //   for (const value of values) {
    //     const user = value.properties;
    //     if (user) {
    //       const promise = this._dbService.findById({
    //         _id: user._id,
    //         dbServiceAccessOptions,
    //       });
    //       promiseArr.push(promise);
    //     } else {
    //       count = value;
    //     }
    //   }
    // }
    // const contents = await Promise.all(promiseArr);
    // const pages = Math.ceil(count / limit) - 1;
    return { contents, pages };
  };

  // if not logged in/no likes or views, recommend default
  // else, recommend user based on likes or views
  private _getGraphQuery = async (props: MakeRequestTemplateParams) => {
    // const { currentAPIUser, query } = props;
    // const { userId } = currentAPIUser;
    // const isLoggedIn = currentAPIUser.userId;
    // const { page, limit } = this._getProcessedQuery(query);
    // const intermediateGraphQuery = isLoggedIn
    //   ? `MATCH (teacher:User { _id: "${userId}"  })-[teaches:teaches]->(students:User) RETURN students, count(*) ORDER BY teaches.since`
    //   : `MATCH (student:User { _id: "${userId}"  })<-[teaches:teaches]-(teachers:User) RETURN teachers, count(*) ORDER BY teaches.since`;
    // const intermediateGraphQuery = `MATCH (user:User: {_id: "${userId}" })`;
    // const graphQuery = `${intermediateGraphQuery} SKIP ${page} LIMIT ${limit}`;
    // return { graphQuery, limit, page };
  };

  private _getProcessedQuery = (query: StringKeyObject): StringKeyObject => {
    const { page, limit } = query;
    const processedQuery = {
      page: page || 0,
      limit: limit || 50,
    };
    return processedQuery;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetContentsUsecaseInitParams
  ): Promise<void> => {
    const { makeGraphDbService } = optionalInitParams;
    this._graphDbService = await makeGraphDbService;
  };
}

export { GetContentsUsecase, GetContentsUsecaseResponse };
