import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { TeacherBalanceEntityBuildResponse } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type PartialFakeDbTeacherBalanceFactoryInitParams = {};
type FakeTeacherBalanceEntityBuildParams = {};

class FakeDbTeacherBalanceFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbTeacherBalanceFactoryInitParams,
  FakeTeacherBalanceEntityBuildParams,
  TeacherBalanceEntityBuildResponse,
  TeacherBalanceDoc
> {}

export { FakeDbTeacherBalanceFactory };
