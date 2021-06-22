import cloneDeep from 'clone-deep';
import { makeTeacherBalanceEntity } from '../../../entities/teacherBalance';
import { makeTeacherBalanceDbService } from '../../services/teacherBalance';
import { FakeDbTeacherBalanceFactory } from './fakeDbTeacherBalanceFactory';

const makeFakeTeacherBalanceFactory = new FakeDbTeacherBalanceFactory().init({
  cloneDeep,
  makeEntity: makeTeacherBalanceEntity,
  makeDbService: makeTeacherBalanceDbService,
});

export { makeFakeTeacherBalanceFactory };
