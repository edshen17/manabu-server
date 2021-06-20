import { makeDb } from '../..';
import { Teacher } from '../../../../models/Teacher';
import { TeacherDbService } from './teacherDbService';

const makeTeacherDbService = new TeacherDbService().init({ makeDb, dbModel: Teacher });

export { makeTeacherDbService };
