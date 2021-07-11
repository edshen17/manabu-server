import { TeacherBalanceEntity } from './teacherBalanceEntity';
import { makeTeacherBalanceEntityValidator } from './validators';

const makeTeacherBalanceEntity = new TeacherBalanceEntity().init({
  makeEntityValidator: makeTeacherBalanceEntityValidator,
});

export { makeTeacherBalanceEntity };
