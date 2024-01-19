import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { Mongoose, ObjectId } from 'mongoose';
import { IS_PRODUCTION, MONGO_HOST, MONGO_PASS } from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';

class DbConnectionHandler {
  private _mongoose!: Mongoose;
  private _replicaSets: MongoMemoryReplSet[] = [];
  private _mongoMemoryReplSet!: typeof MongoMemoryReplSet;

  public connect = async (): Promise<void> => {
    const isDbConnected = this._mongoose.connection.readyState != 0;
    (this._mongoose as any).ObjectId.get((v: ObjectId) => v.toString());
    if (!isDbConnected) {
      const dbUri = await this._getDbUri();
      const mongoDbOptions = this._getMongoDbOptions();
      await this._mongoose.connect(dbUri, mongoDbOptions);
    }
  };

  private _getDbUri = async (): Promise<string> => {
    const dbHost = IS_PRODUCTION ? 'production' : 'production';
    const uriOptions = 'retryWrites=false&w=majority';
    let dbUri = `mongodb+srv://manabu:${MONGO_PASS}@${MONGO_HOST}/${dbHost}?${uriOptions}`;
    if (!IS_PRODUCTION) {
      const mongod = await this._mongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: 'wiredTiger' },
      });
      this._replicaSets.push(mongod);
      dbUri = `${mongod.getUri()}&${uriOptions}`;
    }

    return dbUri;
  };

  private _getMongoDbOptions = (): StringKeyObject => {
    const mongoDbOptions = {
      ignoreUndefined: true,
      readPreference: 'primary',
    };
    return mongoDbOptions;
  };

  public stop = async (): Promise<void> => {
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

  public init = async (props: {
    mongoose: Mongoose;
    MongoMemoryReplSet: typeof MongoMemoryReplSet;
  }): Promise<this> => {
    const { mongoose, MongoMemoryReplSet } = props;
    this._mongoMemoryReplSet = MongoMemoryReplSet;
    this._mongoose = mongoose;
    return this;
  };
}

export { DbConnectionHandler };
