import { TeacherEntityValidator } from './teacherEntityValidator';
import { joi } from '../../../entities/utils/joi';

const makeTeacherEntityValidator = new TeacherEntityValidator().init({ joi });

export { makeTeacherEntityValidator };
