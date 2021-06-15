import { makeUserDbService, makeTeacherDbService } from '../../dataAccess/index';
import { EditTeacherUsecase } from './editTeacherUsecase';

const makeEditTeacherUsecase = new EditTeacherUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
});

export { makeEditTeacherUsecase };
