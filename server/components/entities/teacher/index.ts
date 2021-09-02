import { makeTeacherEntityValidator } from '../../validators/teacher/entity';
import { makePackageEntity } from '../package';
import { TeacherEntity } from './teacherEntity';

const makeTeacherEntity = new TeacherEntity().init({
  makeEntityValidator: makeTeacherEntityValidator,
  makePackageEntity,
});

export { makeTeacherEntity };
