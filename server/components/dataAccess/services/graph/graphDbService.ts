import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';

class GraphDbService {
  private _redisGraph!: any;

  public createUserNode = async (props: {
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { user, dbServiceAccessOptions } = props;
    await this.graphQuery({
      query: `CREATE (user: User { _id: "${user._id}" })`,
      dbServiceAccessOptions,
    });
  };

  public graphQuery = async (props: {
    query: string;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<any> => {
    const { query, dbServiceAccessOptions } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    const graphRes = await this._redisGraph.query(query);
    return graphRes;
  };

  private _testAccessPermitted = (dbServiceAccessOptions: DbServiceAccessOptions) => {
    const { isCurrentAPIUserPermitted } = dbServiceAccessOptions;
    if (!isCurrentAPIUserPermitted) {
      throw new Error('Access denied.');
    }
  };

  public isConnected = async (props: {
    node1: string;
    node2: string;
    relationship: string;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<boolean> => {
    const { node1, node2, relationship, dbServiceAccessOptions } = props;
    this._testAccessPermitted(dbServiceAccessOptions);
    const res = await this._redisGraph.query(
      `MATCH (${node1})-[r${relationship}]-(${node2}) RETURN EXISTS(r)`
    );
    while (res.hasNext()) {
      const record = res.next();
      const booleanArr = record.values();
      return booleanArr.every(Boolean);
    }
    return false;
  };

  public init = async (initParams: { redisGraph: any }): Promise<this> => {
    const { redisGraph } = initParams;
    this._redisGraph = redisGraph;
    return this;
  };
}

export { GraphDbService };
