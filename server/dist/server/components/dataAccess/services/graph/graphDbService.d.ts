import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
declare class GraphDbService {
    private _redisGraph;
    createUserNode: (props: {
        user: JoinedUserDoc;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<void>;
    graphQuery: (props: {
        query: string;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<any>;
    private _testAccessPermitted;
    isConnected: (props: {
        node1: string;
        node2: string;
        relationship: string;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<boolean>;
    init: (initParams: {
        redisGraph: any;
    }) => Promise<this>;
}
export { GraphDbService };
