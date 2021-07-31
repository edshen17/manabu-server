import { joi } from '../../../entities/utils/joi';
import { TeacherQueryValidator } from './teacherQueryValidator';

const makeTeacherQueryValidator = new TeacherQueryValidator().init({ joi });

export { makeTeacherQueryValidator };
