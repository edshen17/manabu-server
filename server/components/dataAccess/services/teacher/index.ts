import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeDb } from '../..';
import { Teacher } from '../../../../models/Teacher';
import { makeCacheDbService } from '../cache';
import { makeUserDbService } from '../user';
import { TeacherDbService } from './teacherDbService';

const makeTeacherDbService = new TeacherDbService().init({
  makeDb,
  cloneDeep,
  makeParentDbService: makeUserDbService,
  dbModel: Teacher,
  deepEqual,
  makeCacheDbService,
});

export { makeTeacherDbService };
