import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { TeacherBalance } from '../../../../models/TeacherBalance';
import { makeCacheDbService } from '../cache';
import { TeacherBalanceDbService } from './teacherBalanceDbService';

const makeTeacherBalanceDbService = new TeacherBalanceDbService().init({
  makeDb,
  dbModel: TeacherBalance,
  cloneDeep,
  makeCacheDbService,
});

export { makeTeacherBalanceDbService };
