import 'dotenv/config';
import { StringKeyObject } from '../../types/custom';

// const mongod = MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
const mongoDbOptions: StringKeyObject = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  ignoreUndefined: true,
  useCreateIndex: true,
  readPreference: 'nearest',
};

//connect to db, if testing do readPreference = primary
//only use mongoose for session
//if production, use nearest and connect to real db

// const makeDb = async (): Promise<MakeDbResponse> => {
//   const dbHost = 'staging'; // change to users
//   const URIOptions = 'retryWrites=false&w=majority';
//   let dbURI = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?${URIOptions}`;
//   if (process.env.NODE_ENV != 'production') {
//     dbURI = `${(await mongod).getUri()}&${URIOptions}`;
//   }

//   if (mongoose.connection.readyState != 1) {
//     await mongoose.connect(dbURI, mongoDbOptions);
//   }
//   return { mongoose, dbURI, mongoDbOptions };
// };

export { mongoDbOptions };
