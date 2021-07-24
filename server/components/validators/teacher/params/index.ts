import { joi } from '../../../entities/utils/joi';
import { TeacherParamsValidator } from './teacherParamsValidator';

const makeTeacherParamsValidator = new TeacherParamsValidator().init({ joi });

export { makeTeacherParamsValidator };
