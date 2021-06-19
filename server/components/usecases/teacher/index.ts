import { makeTeacherDbService } from '../../dataAccess/index';
import { makeUserDbService } from '../../dataAccess/services/user';
import { EditTeacherUsecase } from './editTeacherUsecase';

const makeEditTeacherUsecase = new EditTeacherUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
});

export { makeEditTeacherUsecase };
