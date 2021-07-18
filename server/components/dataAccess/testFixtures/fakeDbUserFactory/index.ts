import faker from 'faker';
import cloneDeep from 'clone-deep';
import { makeUserEntity } from '../../../entities/user';
import { makeUserDbService } from '../../services/user';
import { FakeDbUserFactory } from './fakeDbUserFactory';
import { makeFakeDbTeacherFactory } from '../fakeDbTeacherFactory';
import { makeFakeDbPackageFactory } from '../fakeDbPackageFactory';

const makeFakeDbUserFactory = new FakeDbUserFactory().init({
  faker,
  cloneDeep,
  makeEntity: makeUserEntity,
  makeDbService: makeUserDbService,
  makeFakeDbTeacherFactory,
});

export { makeFakeDbUserFactory };
