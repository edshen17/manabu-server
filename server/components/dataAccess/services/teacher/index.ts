import { makeDb } from '../..';
import { TeacherDbService } from './teacherDbService';
import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../user';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../cache';
import { Teacher } from '../../../../models/Teacher';

const makeTeacherDbService = new TeacherDbService().init({
  makeDb,
  cloneDeep,
  makeParentDbService: makeUserDbService,
  dbModel: Teacher,
  deepEqual,
  makeCacheDbService,
});

export { makeTeacherDbService };
