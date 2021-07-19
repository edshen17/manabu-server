import { makeDb } from '../..';
import { TeacherDbService } from './teacherDbService';
import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../user';
import deepEqual from 'deep-equal';

const makeTeacherDbService = new TeacherDbService().init({
  makeDb,
  cloneDeep,
  makeParentDbService: makeUserDbService,
  dbModel: null,
  deepEqual,
});

export { makeTeacherDbService };
