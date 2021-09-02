import 'dotenv/config';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { StringKeyObject } from '../../types/custom';

type MakeDbResponse = {
  mongoose: typeof mongoose;
  dbURI: string;
  mongoDbOptions: StringKeyObject;
};
const mongod = MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });

const makeDb = async (): Promise<MakeDbResponse> => {
  const dbHost = 'staging'; // change to users
  const URIOptions = 'retryWrites=false&w=majority';
  let dbURI = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?${URIOptions}`;
  if (process.env.NODE_ENV != 'production') {
    dbURI = `${(await mongod).getUri()}&${URIOptions}`;
  }
  const mongoDbOptions: StringKeyObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    ignoreUndefined: true,
    useCreateIndex: true,
    readPreference: 'nearest',
  };
  if (mongoose.connection.readyState != 1) {
    await mongoose.connect(dbURI, mongoDbOptions);
  }
  return { mongoose, dbURI, mongoDbOptions };
};

export { makeDb, MakeDbResponse, mongod };
