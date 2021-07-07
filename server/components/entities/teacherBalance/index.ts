import { TeacherBalanceEntity } from './teacherBalanceEntity';
import { makeTeacherBalanceEntityValidator } from './validator';

const makeTeacherBalanceEntity = new TeacherBalanceEntity().init({
  makeEntityValidator: makeTeacherBalanceEntityValidator,
});

export { makeTeacherBalanceEntity };
