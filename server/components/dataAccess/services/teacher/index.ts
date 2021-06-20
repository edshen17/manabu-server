import { makeDb } from '../..';
import { Teacher } from '../../../../models/Teacher';
import { TeacherDbService } from './teacherDbService';
import cloneDeep from 'clone-deep';

const makeTeacherDbService = new TeacherDbService().init({ makeDb, dbModel: Teacher, cloneDeep });

export { makeTeacherDbService };
