"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphDbService = void 0;
class GraphDbService {
    _redisGraph;
    createUserNode = async (props) => {
        const { user, dbServiceAccessOptions } = props;
        await this.graphQuery({
            query: `CREATE (user: User { _id: "${user._id}" })`,
            dbServiceAccessOptions,
        });
    };
    graphQuery = async (props) => {
        const { query, dbServiceAccessOptions } = props;
        this._testAccessPermitted(dbServiceAccessOptions);
        const graphRes = await this._redisGraph.query(query);
        return graphRes;
    };
    _testAccessPermitted = (dbServiceAccessOptions) => {
        const { isCurrentAPIUserPermitted } = dbServiceAccessOptions;
        if (!isCurrentAPIUserPermitted) {
            throw new Error('Access denied.');
        }
    };
    isConnected = async (props) => {
        const { node1, node2, relationship, dbServiceAccessOptions } = props;
        this._testAccessPermitted(dbServiceAccessOptions);
        const res = await this._redisGraph.query(`MATCH (:${node1})-[r:${relationship}]-(:${node2}) RETURN EXISTS(r)`);
        while (res.hasNext()) {
            const record = res.next();
            const booleanArr = record.values();
            return booleanArr.every(Boolean);
        }
        return false;
    };
    init = async (initParams) => {
        const { redisGraph } = initParams;
        this._redisGraph = redisGraph;
        return this;
    };
}
exports.GraphDbService = GraphDbService;
