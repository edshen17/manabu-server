import faker from 'faker';
import { makePackageEntity } from '../../../entities/package';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makeUserEntity } from '../../../entities/user';
import { makePackageDbService } from '../../services/package';
import { makeTeacherDbService } from '../../services/teacher';
import { makeUserDbService } from '../../services/user';
import { FakeDbUserFactory } from './fakeDbUserFactory';
import cloneDeep from 'clone-deep';

const makeFakeDbUserFactory = new FakeDbUserFactory().init({
  faker,
  cloneDeep,
  makeEntity: makeUserEntity,
  makeTeacherEntity,
  makePackageEntity,
  makeDbService: makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
});

export { makeFakeDbUserFactory };
