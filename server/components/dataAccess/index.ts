import mongoose from 'mongoose';
import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
const mongod = new MongoMemoryServer();

const makeDb = async (): Promise<mongoose.Mongoose | void> => {
  if (mongoose.connection.readyState != 1) {
    let dbHost: string = 'dev'; // change to users
    let dbURI: string = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`;
    if (process.env.NODE_ENV != 'production') {
      dbURI = await mongod.getUri();
    }

    return await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      ignoreUndefined: true,
      useCreateIndex: true,
      readPreference: 'nearest',
    });
  }
};

export { makeDb };
