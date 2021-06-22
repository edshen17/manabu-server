import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { TeacherBalanceEntityResponse } from '../../../entities/teacherBalance/teacherBalanceEntity';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';

class FakeDbTeacherBalanceFactory extends AbstractDbDataFactory<
  TeacherBalanceDoc,
  TeacherBalanceEntityResponse
> {}

export { FakeDbTeacherBalanceFactory };
