import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { Mongoose } from 'mongoose';
import { StringKeyObject } from '../../../../types/custom';

class DbConnectionHandler {
  private _dbConnection!: Mongoose;
  private _mongoose!: Mongoose;
  private _replicaSets: MongoMemoryReplSet[] = [];
  private _mongoMemoryReplSet!: typeof MongoMemoryReplSet;

  public connect = async (): Promise<void> => {
    const isDbConnected = this._dbConnection && this._dbConnection.connection.readyState != 0;
    if (!isDbConnected) {
      const URIOptions = 'retryWrites=false&w=majority';
      const mongod = await this._mongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: 'wiredTiger' },
      });
      this._replicaSets.push(mongod);
      const dbURI = `${mongod.getUri()}&${URIOptions}`;
      const mongoDbOptions = this._getMongoDbOptions();
      this._dbConnection = await this._mongoose.connect(dbURI, mongoDbOptions);
    }
  };

  private _getMongoDbOptions = (): StringKeyObject => {
    const mongoDbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      ignoreUndefined: true,
      useCreateIndex: true,
      readPreference: 'primary',
    };
    if (process.env.NODE_ENV == 'production') {
      mongoDbOptions.readPreference = 'nearest';
    }
    return mongoDbOptions;
  };

  public stop = async (): Promise<void> => {
    if (this._dbConnection) {
      await this._dbConnection.disconnect();
    }
    for (const replicaSet of this._replicaSets) {
      await replicaSet.stop();
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
