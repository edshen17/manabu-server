import { TeacherEntity } from './teacherEntity';
import { makeTeacherEntityValidator } from '../../validators/teacher/entity';

const makeTeacherEntity = new TeacherEntity().init({
  makeEntityValidator: makeTeacherEntityValidator,
});

export { makeTeacherEntity };
