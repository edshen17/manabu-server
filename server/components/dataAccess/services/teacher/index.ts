import { makeDb } from '../..';
import { TeacherDbService } from './teacherDbService';
import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../user';

const makeTeacherDbService = new TeacherDbService().init({
  makeDb,
  cloneDeep,
  makeUserDbService,
  dbModel: null,
});

export { makeTeacherDbService };
