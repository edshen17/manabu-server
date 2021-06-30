import { image as fakerImage, internet as fakerInternet, name as fakerName } from 'faker';
import cloneDeep from 'clone-deep';
import { makeUserEntity } from '../../../entities/user';
import { makeUserDbService } from '../../services/user';
import { FakeDbUserFactory } from './fakeDbUserFactory';
import { makeFakeDbTeacherFactory } from '../fakeDbTeacherFactory';
import { makeFakeDbPackageFactory } from '../fakeDbPackageFactory';

const makeFakeDbUserFactory = new FakeDbUserFactory().init({
  fakerImage,
  fakerInternet,
  fakerName,
  cloneDeep,
  makeEntity: makeUserEntity,
  makeDbService: makeUserDbService,
  makeFakeDbTeacherFactory,
  makeFakeDbPackageFactory,
});

export { makeFakeDbUserFactory };
