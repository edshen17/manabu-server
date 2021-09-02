import { joi } from '../../../entities/utils/joi';
import { TeacherBalanceEntityValidator } from './teacherBalanceEntityValidator';

const makeTeacherBalanceEntityValidator = new TeacherBalanceEntityValidator().init({ joi });

export { makeTeacherBalanceEntityValidator };
