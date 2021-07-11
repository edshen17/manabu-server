import { TeacherEntity } from './teacherEntity';
import { makeTeacherEntityValidator } from './validators';

const makeTeacherEntity = new TeacherEntity().init({
  makeEntityValidator: makeTeacherEntityValidator,
});

export { makeTeacherEntity };
