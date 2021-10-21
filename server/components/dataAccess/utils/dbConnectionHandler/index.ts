import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import { DbConnectionHandler } from './dbConnectionHandler';

const makeMongod = MongoMemoryReplSet.create({
  replSet: { count: 1, storageEngine: 'wiredTiger' },
});

const makeDbConnectionHandler = new DbConnectionHandler().init({ mongoose, makeMongod });

export { makeDbConnectionHandler };
