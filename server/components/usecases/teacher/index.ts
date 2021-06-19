import { makeTeacherDbService } from '../../dataAccess/index';
import { makeUserDbService } from '../../dataAccess/services/usersDb';
import { EditTeacherUsecase } from './editTeacherUsecase';

const makeEditTeacherUsecase = new EditTeacherUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
});

export { makeEditTeacherUsecase };
