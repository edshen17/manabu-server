import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { TeacherBalanceEntityResponse } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type FakeDbTeacherBalanceFactoryInitParams = {};
type FakeTeacherBalanceEntityParams = {};

class FakeDbTeacherBalanceFactory extends AbstractFakeDbDataFactory<
  FakeDbTeacherBalanceFactoryInitParams,
  FakeTeacherBalanceEntityParams,
  TeacherBalanceEntityResponse,
  TeacherBalanceDoc
> {}

export { FakeDbTeacherBalanceFactory };
