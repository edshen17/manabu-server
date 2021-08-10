import { mongod } from './server/components/dataAccess';

const mochaGlobalSetup = () => {
  const ENV_VARIABLES = require('dotenv').config();
};

const mochaGlobalTeardown = async () => {
  (await mongod).stop(true);
};

export { mochaGlobalSetup, mochaGlobalTeardown };
