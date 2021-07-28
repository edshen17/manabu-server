import { makeDb } from '../..';
import { TeacherBalance } from '../../../../models/TeacherBalance';
import { TeacherBalanceDbService } from './teacherBalanceDbService';
import cloneDeep from 'clone-deep';
import { makeCacheDbService } from '../cache';

const makeTeacherBalanceDbService = new TeacherBalanceDbService().init({
  makeDb,
  dbModel: TeacherBalance,
  cloneDeep,
  makeCacheDbService,
});

export { makeTeacherBalanceDbService };
