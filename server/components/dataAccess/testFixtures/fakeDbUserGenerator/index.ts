import faker from 'faker';
import { makePackageDbService, makeTeacherDbService } from '../..';
import { makePackageEntity } from '../../../entities/package';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makeUserEntity } from '../../../entities/user';
import { makeUserDbService } from '../../services/usersDb';
import { FakeDBUserGenerator } from './fakeDbUserGenerator';

const makeFakeDbUserGenerator = new FakeDBUserGenerator().init({
  faker,
  makeUserEntity,
  makeTeacherEntity,
  makePackageEntity,
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
});

export { makeFakeDbUserGenerator };
