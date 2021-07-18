import { TeacherEntity } from './teacherEntity';
import { makeTeacherEntityValidator } from '../../validators/teacher/entity';
import { makePackageEntity } from '../package';

const makeTeacherEntity = new TeacherEntity().init({
  makeEntityValidator: makeTeacherEntityValidator,
  makePackageEntity,
});

export { makeTeacherEntity };
