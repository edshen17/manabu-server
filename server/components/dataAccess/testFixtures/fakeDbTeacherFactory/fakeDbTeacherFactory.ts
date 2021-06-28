import { TeacherDoc } from '../../../../models/Teacher';
import { TeacherEntityResponse } from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type FakeDbTeacherFactoryInitParams = {};
type FakeTeacherEntityParams = {};

class FakeDbTeacherFactory extends AbstractFakeDbDataFactory<
  FakeDbTeacherFactoryInitParams,
  FakeTeacherEntityParams,
  TeacherEntityResponse,
  TeacherDoc
> {}

export { FakeDbTeacherFactory };
