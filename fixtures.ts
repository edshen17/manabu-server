import { makeDb, mongod } from './server/components/dataAccess';

const mochaGlobalSetup = () => {
  const ENV_VARIABLES = require('dotenv').config();
};

const mochaGlobalTeardown = async () => {
  const { mongoose } = await makeDb();
  await mongoose.disconnect();
  (await mongod).stop();
  (await mongod).cleanup(true);
};

export { mochaGlobalSetup, mochaGlobalTeardown };
