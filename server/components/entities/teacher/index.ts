import { TeacherEntity } from './teacherEntity';
import { makeTeacherEntityValidator } from './validator';

const makeTeacherEntity = new TeacherEntity().init({
  makeEntityValidator: makeTeacherEntityValidator,
});

export { makeTeacherEntity };
