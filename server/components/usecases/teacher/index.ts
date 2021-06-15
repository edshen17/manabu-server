import { makeUserDbService, makeTeacherDbService } from '../../dataAccess/index';
import { PutEditTeacherUsecase } from './putEditTeacherUsecase';

const makePutEditTeacherUsecase = new PutEditTeacherUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
});

export { makePutEditTeacherUsecase };
