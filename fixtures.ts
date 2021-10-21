import { makeDbConnectionHandler } from './server/components/dataAccess/utils/dbConnectionHandler';
import { DbConnectionHandler } from './server/components/dataAccess/utils/dbConnectionHandler/dbConnectionHandler';

let dbConnectionHandler: DbConnectionHandler;

(async () => {
  dbConnectionHandler = await makeDbConnectionHandler;
  await dbConnectionHandler.connect();
})();

const mochaHooks = {
  async beforeAll(): Promise<void> {
    // dbConnectionHandler = await makeDbConnectionHandler;
    // await dbConnectionHandler.connect();
  },
  async afterAll(): Promise<void> {
    // await dbConnectionHandler.stop();
    // const collectionNames = mongoose.modelNames().map((modelName) => {
    //   return modelName.toLowerCase();
    // });
    // for (const name of collectionNames) {
    //   console.log(name);
    //   await mongoose.connection.dropCollection(name);
    // }
    // const db = await mongoose.connection.dropCollection();
    // console.log(db);
    // const collections = await mongoose.connection.db.collections();
    // for (const collection of collections) {
    //   await collection.drop();
    // }
  },
};

const mochaGlobalSetup = async () => {
  const ENV_VARIABLES = require('dotenv').config();
};

const mochaGlobalTeardown = async () => {
  await dbConnectionHandler.stop();
  return;
};

export { mochaGlobalSetup, mochaGlobalTeardown, mochaHooks };
