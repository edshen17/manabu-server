import { TeacherDoc } from '../../../../models/Teacher';
import { TeacherEntityBuildResponse } from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type FakeDbTeacherFactoryInitParams = {};
type FakeTeacherEntityParams = {};

class FakeDbTeacherFactory extends AbstractFakeDbDataFactory<
  FakeDbTeacherFactoryInitParams,
  FakeTeacherEntityParams,
  TeacherEntityBuildResponse,
  TeacherDoc
> {}

export { FakeDbTeacherFactory };
