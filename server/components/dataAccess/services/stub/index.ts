import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { makeCacheDbService } from '../cache';
import { StubDbService } from './stubDbService';

const makeStubDbService = new StubDbService().init({
  makeDb,
  dbModel: undefined,
  cloneDeep,
  makeCacheDbService,
});

export { makeStubDbService };
