import { expect } from 'chai';
import mongoose from 'mongoose';
import { makeDbConnectionHandler } from '.';
import { DbConnectionHandler } from './dbConnectionHandler';

let dbConnectionHandler: DbConnectionHandler;

before(async () => {
  dbConnectionHandler = await makeDbConnectionHandler;
});

describe('dbConnectionHandler', () => {
  it('should connect to the db', async () => {
    await dbConnectionHandler.connect();
    expect(mongoose.connection.readyState != 0).to.equal(true);
    await dbConnectionHandler.stop();
  });
  it('should disconnect from the db', async () => {
    await dbConnectionHandler.connect();
    await dbConnectionHandler.stop();
    expect(mongoose.connection.readyState == 0).to.equal(true);
  });
});
