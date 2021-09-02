import { makeTeacherBalanceEntityValidator } from '../../validators/teacherBalance/entity';
import { TeacherBalanceEntity } from './teacherBalanceEntity';

const makeTeacherBalanceEntity = new TeacherBalanceEntity().init({
  makeEntityValidator: makeTeacherBalanceEntityValidator,
});

export { makeTeacherBalanceEntity };
