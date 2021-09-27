import { makePackageEntity } from '../../../entities/package';
import { makeTeacherEntity } from '../../../entities/teacher';
import { FakeDbTeacherFactory } from './fakeDbTeacherFactory';

const makeFakeDbTeacherFactory = new FakeDbTeacherFactory().init({
  makeEntity: makeTeacherEntity,
  makePackageEntity,
});

export { makeFakeDbTeacherFactory };
