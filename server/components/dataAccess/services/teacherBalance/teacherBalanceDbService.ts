import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type PartialTeacherBalanceDbServiceInitParams = {};

type TeacherBalanceResponse = TeacherBalanceDoc;

class TeacherBalanceDbService extends AbstractDbService<
  PartialTeacherBalanceDbServiceInitParams,
  TeacherBalanceResponse
> {}

export { TeacherBalanceDbService, TeacherBalanceResponse };
