import { makeDb } from '../..';
import { Teacher } from '../../../../models/Teacher';
import { TeacherDbService } from './teacherDbService';

const makeTeacherDbService = new TeacherDbService({ teacherDb: Teacher }).init({ makeDb });

export { makeTeacherDbService };
