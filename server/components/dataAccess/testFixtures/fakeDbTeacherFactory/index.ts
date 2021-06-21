import cloneDeep from 'clone-deep';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makeTeacherDbService } from '../../services/teacher';
import { FakeDbTeacherFactory } from './fakeDbTeacherFactory';

const makeFakeDbTeacherFactory = new FakeDbTeacherFactory().init({
  makeEntity: makeTeacherEntity,
  cloneDeep,
  makeDbService: makeTeacherDbService,
});

export { makeFakeDbTeacherFactory };
