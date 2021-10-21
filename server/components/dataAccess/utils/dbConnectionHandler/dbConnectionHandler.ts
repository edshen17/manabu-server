import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { Mongoose } from 'mongoose';
import { StringKeyObject } from '../../../../types/custom';

class DbConnectionHandler {
  private _dbConnection!: Mongoose;
  private _mongoose!: Mongoose;
  private _mongod!: MongoMemoryReplSet;
  private _mongoMemoryReplSet!: typeof MongoMemoryReplSet;

  public connect = async (): Promise<void> => {
    if (
      !this._dbConnection ||
      (this._dbConnection && this._dbConnection.connection.readyState == 0)
    ) {
      const URIOptions = 'retryWrites=false&w=majority';
      if (this._mongod.state == 'stopped') {
        this._mongod = await this._mongoMemoryReplSet.create({
          replSet: { count: 1, storageEngine: 'wiredTiger' },
        });
      }
      const dbURI = `${this._mongod.getUri()}&${URIOptions}`;
      const mongoDbOptions: StringKeyObject = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        ignoreUndefined: true,
        useCreateIndex: true,
        readPreference: 'primary',
      };
      this._dbConnection = await this._mongoose.connect(dbURI, mongoDbOptions);
    }
  };

  public stop = async (): Promise<void> => {
    this._mongod.state;
    try {
      if (this._dbConnection) {
        await this._dbConnection.disconnect();
      }
      if (this._mongod && ['running', 'init'].includes(this._mongod.state)) {
        await this._mongod.stop();
      }
    } catch (err) {
      return;
    }
  };

  public init = async (props: {
    mongoose: Mongoose;
    makeMongod: Promise<MongoMemoryReplSet>;
    MongoMemoryReplSet: typeof MongoMemoryReplSet;
  }): Promise<this> => {
    const { mongoose, makeMongod, MongoMemoryReplSet } = props;
    this._mongoMemoryReplSet = MongoMemoryReplSet;
    this._mongoose = mongoose;
    this._mongod = await makeMongod;
    return this;
  };
}

export { DbConnectionHandler };
