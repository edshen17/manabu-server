import mongoose from 'mongoose';
import 'dotenv/config';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

type MakeDbResponse =
  | {
      mongoose: typeof mongoose;
      dbURI: string;
      mongoDbOptions: any;
    }
  | undefined;

const mongod = MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
const makeDb = async (): Promise<MakeDbResponse> => {
  if (mongoose.connection.readyState != 1) {
    let dbHost = 'staging'; // change to users
    let URIOptions = 'retryWrites=false&w=majority';
    let dbURI = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?${URIOptions}`;
    if (process.env.NODE_ENV != 'production') {
      dbURI = `${(await mongod).getUri()}&${URIOptions}`;
    }
    const mongoDbOptions: any = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      ignoreUndefined: true,
      useCreateIndex: true,
      readPreference: 'nearest',
    };
    await mongoose.connect(dbURI, mongoDbOptions);
    return { mongoose, dbURI, mongoDbOptions };
  }
};

export { makeDb, MakeDbResponse };
