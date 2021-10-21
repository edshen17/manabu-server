import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import { DbConnectionHandler } from './dbConnectionHandler';

const makeDbConnectionHandler = new DbConnectionHandler().init({
  mongoose,
  MongoMemoryReplSet,
});

export { makeDbConnectionHandler };
