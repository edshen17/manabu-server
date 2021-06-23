import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { TeacherBalanceEntityResponse } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

class FakeDbTeacherBalanceFactory extends AbstractFakeDbDataFactory<
  TeacherBalanceDoc,
  TeacherBalanceEntityResponse
> {}

export { FakeDbTeacherBalanceFactory };
