import cloneDeep from 'clone-deep';
import faker from 'faker';
import { makeUserEntity } from '../../../entities/user';
import { makeCacheDbService } from '../../services/cache';
import { makeUserDbService } from '../../services/user';
import { makeFakeDbTeacherFactory } from '../fakeDbTeacherFactory';
import { FakeDbUserFactory } from './fakeDbUserFactory';

const makeFakeDbUserFactory = new FakeDbUserFactory().init({
  faker,
  cloneDeep,
  makeEntity: makeUserEntity,
  makeDbService: makeUserDbService,
  makeFakeDbTeacherFactory,
  makeCacheDbService,
});

export { makeFakeDbUserFactory };
