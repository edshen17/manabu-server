"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnectionHandler = void 0;
const constants_1 = require("../../../../constants");
class DbConnectionHandler {
    _mongoose;
    _replicaSets = [];
    _mongoMemoryReplSet;
    connect = async () => {
        const isDbConnected = this._mongoose.connection.readyState != 0;
        this._mongoose.ObjectId.get((v) => v.toString());
        if (!isDbConnected) {
            const dbUri = await this._getDbUri();
            const mongoDbOptions = this._getMongoDbOptions();
            await this._mongoose.connect(dbUri, mongoDbOptions);
        }
    };
    _getDbUri = async () => {
        const dbHost = constants_1.IS_PRODUCTION ? 'production' : 'staging'; // change to users
        const uriOptions = 'retryWrites=false&w=majority';
        let dbUri = `mongodb+srv://manabu:${constants_1.MONGO_PASS}@${constants_1.MONGO_HOST}/${dbHost}?${uriOptions}`;
        if (!constants_1.IS_PRODUCTION) {
            const mongod = await this._mongoMemoryReplSet.create({
                replSet: { count: 1, storageEngine: 'wiredTiger' },
            });
            this._replicaSets.push(mongod);
            dbUri = `${mongod.getUri()}&${uriOptions}`;
        }
        return dbUri;
    };
    _getMongoDbOptions = () => {
        const mongoDbOptions = {
            ignoreUndefined: true,
            readPreference: 'primary',
        };
        // if (IS_PRODUCTION) {
        //   mongoDbOptions.readPreference = 'nearest';
        // }
        return mongoDbOptions;
    };
    stop = async () => {
        const isDbConnected = this._mongoose.connection.readyState != 0;
        if (isDbConnected) {
            await this._mongoose.disconnect();
        }
        for (const replicaSet of this._replicaSets) {
            const isReplicaSetConnected = replicaSet.state != 'stopped';
            if (isReplicaSetConnected) {
                await replicaSet.stop();
            }
        }
    };
    init = async (props) => {
        const { mongoose, MongoMemoryReplSet } = props;
        this._mongoMemoryReplSet = MongoMemoryReplSet;
        this._mongoose = mongoose;
        return this;
    };
}
exports.DbConnectionHandler = DbConnectionHandler;
