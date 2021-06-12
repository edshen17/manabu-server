import { makeUserDbService, makeTeacherDbService } from '../../dataAccess/index';
import { PutTeacherUsecase } from './putTeacherUsecase';

const makePutTeacherUsecase = new PutTeacherUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
});

export { makePutTeacherUsecase };
