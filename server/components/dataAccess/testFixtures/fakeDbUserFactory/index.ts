import faker from 'faker';
import { makePackageEntity } from '../../../entities/package';
import { makeUserEntity } from '../../../entities/user';
import { makePackageDbService } from '../../services/package';
import { makeUserDbService } from '../../services/user';
import { FakeDbUserFactory } from './fakeDbUserFactory';
import cloneDeep from 'clone-deep';
import { makeFakeDbTeacherFactory } from '../fakeDbTeacherFactory';

const makeFakeDbUserFactory = new FakeDbUserFactory().init({
  faker,
  cloneDeep,
  makeEntity: makeUserEntity,
  makePackageEntity,
  makeDbService: makeUserDbService,
  makeFakeDbTeacherFactory,
  makePackageDbService,
});

export { makeFakeDbUserFactory };
