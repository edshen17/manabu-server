import { TeacherDoc } from '../../../../models/Teacher';
import { TeacherEntityBuildResponse } from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type PartialFakeDbTeacherFactoryInitParams = {};
type FakeTeacherEntityBuildParams = {};

class FakeDbTeacherFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbTeacherFactoryInitParams,
  FakeTeacherEntityBuildParams,
  TeacherEntityBuildResponse,
  TeacherDoc
> {}

export { FakeDbTeacherFactory };
