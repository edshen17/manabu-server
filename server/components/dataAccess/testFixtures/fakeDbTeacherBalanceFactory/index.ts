import cloneDeep from 'clone-deep';
import { makeTeacherBalanceEntity } from '../../../entities/teacherBalance';
import { makeTeacherBalanceDbService } from '../../services/teacherBalance';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbTeacherBalanceFactory } from './fakeDbTeacherBalanceFactory';

const makeFakeDbTeacherBalanceFactory = new FakeDbTeacherBalanceFactory().init({
  cloneDeep,
  makeEntity: makeTeacherBalanceEntity,
  makeDbService: makeTeacherBalanceDbService,
  makeFakeDbUserFactory,
});

export { makeFakeDbTeacherBalanceFactory };
