import { TeacherEntityValidator } from './teacherEntityValidator';
import { extendedJoi as joi } from '../../utils/joi/extendedJoi';

const makeTeacherEntityValidator = new TeacherEntityValidator().init({ joi });

export { makeTeacherEntityValidator };
