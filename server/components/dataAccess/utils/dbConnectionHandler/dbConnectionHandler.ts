import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { Mongoose } from 'mongoose';
import { StringKeyObject } from '../../../../types/custom';

class DbConnectionHandler {
  private _dbConnection!: Mongoose;
  private _mongoose!: Mongoose;
  private _mongod!: MongoMemoryReplSet;

  public connect = async (): Promise<void> => {
    if (
      !this._dbConnection ||
      (this._dbConnection && this._dbConnection.connection.readyState == 0)
    ) {
      const URIOptions = 'retryWrites=false&w=majority';
      const dbURI = `${this._mongod.getUri()}&${URIOptions}`;
      const mongoDbOptions: StringKeyObject = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        ignoreUndefined: true,
        useCreateIndex: true,
        readPreference: 'nearest',
      };
      this._dbConnection = await this._mongoose.connect(dbURI, mongoDbOptions);
      console.log('connected');
    }
  };

  public stop = async (): Promise<void> => {
    if (this._dbConnection) {
      await this._dbConnection.disconnect();
      await this._mongod.stop();
      console.log('stopped');
    }
  };

  public init = async (props: {
    mongoose: Mongoose;
    makeMongod: Promise<MongoMemoryReplSet>;
  }): Promise<this> => {
    const { mongoose, makeMongod } = props;
    this._mongoose = mongoose;
    this._mongod = await makeMongod;
    return this;
  };
}

export { DbConnectionHandler };
