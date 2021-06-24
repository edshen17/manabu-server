import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { EditTeacherUsecase } from './editTeacherUsecase';

const makeEditTeacherUsecase = new EditTeacherUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
});

export { makeEditTeacherUsecase };
