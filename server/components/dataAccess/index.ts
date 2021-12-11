import 'dotenv/config';
import { StringKeyObject } from '../../types/custom';

const mongoDbOptions: StringKeyObject = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  ignoreUndefined: true,
  useCreateIndex: true,
  readPreference: 'nearest',
};

export { mongoDbOptions };
