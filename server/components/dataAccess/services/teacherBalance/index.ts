import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { TeacherBalance } from '../../../../models/TeacherBalance';
import { makeCacheDbService } from '../cache';
import { TeacherBalanceDbService } from './teacherBalanceDbService';

const makeTeacherBalanceDbService = new TeacherBalanceDbService().init({
  mongoose,
  dbModel: TeacherBalance,
  cloneDeep,
  makeCacheDbService,
});

export { makeTeacherBalanceDbService };
