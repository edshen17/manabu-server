import mongoose from 'mongoose';
import 'dotenv/config';
import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';
type MakeDbResponse =
  | {
      mongoose: typeof mongoose;
      dbURI: string;
      mongoDbOptions: any;
    }
  | undefined;
const mongod = new MongoMemoryReplSet();
const makeDb = async (): Promise<MakeDbResponse> => {
  if (mongoose.connection.readyState != 1) {
    let dbHost = 'staging'; // change to users
    let dbURI = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=false&w=majority`;
    if (process.env.NODE_ENV != 'production') {
      dbURI = await mongod.getUri();
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
