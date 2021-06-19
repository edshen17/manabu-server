import { makeDb } from '../..';
import { TeacherBalance } from '../../../../models/TeacherBalance';
import { TeacherBalanceDbService } from './teacherBalanceDbService';

const makeTeacherBalanceDbService = new TeacherBalanceDbService({
  teacherBalanceDb: TeacherBalance,
}).init({ makeDb });

export { makeTeacherBalanceDbService };
