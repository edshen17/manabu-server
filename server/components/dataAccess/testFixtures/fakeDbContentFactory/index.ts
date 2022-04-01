import cloneDeep from 'clone-deep';
import fs from 'fs';
import { makeContentEntity } from '../../../entities/content';
import { makeContentDbService } from '../../services/content';
import { FakeDbContentFactory } from './fakeDbContentFactory';

const makeFakeDbContentFactory = new FakeDbContentFactory().init({
  makeEntity: makeContentEntity,
  cloneDeep,
  makeDbService: makeContentDbService,
  fs,
});

export { makeFakeDbContentFactory };
