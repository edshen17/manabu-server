import { makeDb } from '../..';
import { TeacherBalance } from '../../../../models/TeacherBalance';
import { TeacherBalanceDbService } from './teacherBalanceDbService';

const makeTeacherBalanceDbService = new TeacherBalanceDbService().init({
  makeDb,
  dbModel: TeacherBalance,
});

export { makeTeacherBalanceDbService };
