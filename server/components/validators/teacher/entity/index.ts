import { joi } from '../../../entities/utils/joi';
import { TeacherEntityValidator } from './teacherEntityValidator';

const makeTeacherEntityValidator = new TeacherEntityValidator().init({ joi });

export { makeTeacherEntityValidator };
