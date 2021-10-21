import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { makeCacheDbService } from '../cache';
import { StubDbService } from './stubDbService';

const makeStubDbService = new StubDbService().init({
  mongoose,
  dbModel: undefined,
  cloneDeep,
  makeCacheDbService,
});

export { makeStubDbService };
