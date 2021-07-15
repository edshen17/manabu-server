import { TeacherBalanceEntityValidator } from './teacherBalanceEntityValidator';
import { joi } from '../../../entities/utils/joi';

const makeTeacherBalanceEntityValidator = new TeacherBalanceEntityValidator().init({ joi });

export { makeTeacherBalanceEntityValidator };
