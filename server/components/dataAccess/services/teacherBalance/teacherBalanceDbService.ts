import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type PartialTeacherBalanceDbServiceInitParams = {};

class TeacherBalanceDbService extends AbstractDbService<
  PartialTeacherBalanceDbServiceInitParams,
  TeacherBalanceDoc
> {}

export { TeacherBalanceDbService };
