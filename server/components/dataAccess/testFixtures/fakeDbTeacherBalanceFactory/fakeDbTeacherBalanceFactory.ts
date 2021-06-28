import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { TeacherBalanceEntityBuildResponse } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type FakeDbTeacherBalanceFactoryInitParams = {};
type FakeTeacherBalanceEntityParams = {};

class FakeDbTeacherBalanceFactory extends AbstractFakeDbDataFactory<
  FakeDbTeacherBalanceFactoryInitParams,
  FakeTeacherBalanceEntityParams,
  TeacherBalanceEntityBuildResponse,
  TeacherBalanceDoc
> {}

export { FakeDbTeacherBalanceFactory };
