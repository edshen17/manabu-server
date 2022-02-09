import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { Mongoose } from 'mongoose';
declare class DbConnectionHandler {
    private _mongoose;
    private _replicaSets;
    private _mongoMemoryReplSet;
    connect: () => Promise<void>;
    private _getDbUri;
    private _getMongoDbOptions;
    stop: () => Promise<void>;
    init: (props: {
        mongoose: Mongoose;
        MongoMemoryReplSet: typeof MongoMemoryReplSet;
    }) => Promise<this>;
}
export { DbConnectionHandler };
