import faker from 'faker';
import { makeTeacherDbService } from '../..';
import { makePackageEntity } from '../../../entities/package';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makeUserEntity } from '../../../entities/user';
import { makePackageDbService } from '../../services/package';
import { makeUserDbService } from '../../services/user';
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
