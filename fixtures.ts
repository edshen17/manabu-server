import { makeDbConnectionHandler } from './server/components/dataAccess/utils/dbConnectionHandler';
import { DbConnectionHandler } from './server/components/dataAccess/utils/dbConnectionHandler/dbConnectionHandler';

let dbConnectionHandler: DbConnectionHandler;

const mochaHooks = {
  async beforeAll(): Promise<void> {
    dbConnectionHandler = await makeDbConnectionHandler;
    await dbConnectionHandler.connect();
  },
  async afterAll(): Promise<void> {
    await dbConnectionHandler.stop();
  },
};

const mochaGlobalSetup = async () => {
  const ENV_VARIABLES = require('dotenv').config();
};

const mochaGlobalTeardown = async () => {
  // await dbConnectionHandler.stop();
  // return;
};

export { mochaGlobalSetup, mochaGlobalTeardown, mochaHooks };
