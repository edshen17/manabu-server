import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';

type PartialTeacherBalanceDbServiceInitParams = {};

class TeacherBalanceDbService extends AbstractDbService<
  PartialTeacherBalanceDbServiceInitParams,
  TeacherBalanceDoc
> {}

export { TeacherBalanceDbService };
