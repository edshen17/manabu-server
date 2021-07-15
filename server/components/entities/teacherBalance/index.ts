import { TeacherBalanceEntity } from './teacherBalanceEntity';
import { makeTeacherBalanceEntityValidator } from '../../validators/teacherBalance/entity';

const makeTeacherBalanceEntity = new TeacherBalanceEntity().init({
  makeEntityValidator: makeTeacherBalanceEntityValidator,
});

export { makeTeacherBalanceEntity };
