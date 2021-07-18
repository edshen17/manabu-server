import { makeTeacherEntity } from '../../../entities/teacher';
import { FakeDbTeacherFactory } from './fakeDbTeacherFactory';

const makeFakeDbTeacherFactory = new FakeDbTeacherFactory().init({
  makeEntity: makeTeacherEntity,
});

export { makeFakeDbTeacherFactory };
