import { TeacherBalanceEntityValidator } from './teacherBalanceEntityValidator';
import { extendedJoi as joi } from '../../utils/joi/extendedJoi';

const makeTeacherBalanceEntityValidator = new TeacherBalanceEntityValidator().init({ joi });

export { makeTeacherBalanceEntityValidator };
