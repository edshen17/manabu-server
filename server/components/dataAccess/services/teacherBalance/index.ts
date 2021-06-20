import { makeDb } from '../..';
import { TeacherBalance } from '../../../../models/TeacherBalance';
import { TeacherBalanceDbService } from './teacherBalanceDbService';
import cloneDeep from 'clone-deep';

const makeTeacherBalanceDbService = new TeacherBalanceDbService().init({
  makeDb,
  dbModel: TeacherBalance,
  cloneDeep,
});

export { makeTeacherBalanceDbService };
