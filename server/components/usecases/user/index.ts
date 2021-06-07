import jwt from 'jsonwebtoken';
import {
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
} from '../../dataAccess/index';
import { GetUserUsecase } from './getUserUsecase';
import { PostUserUsecase } from './postUserUsecase';
import { PutUserUsecase } from './putUserUsecase';
import { emailHandler } from '../../utils/email/emailHandler';

const makeGetUserUsecase = new GetUserUsecase().init({ makeUserDbService });
const makePostUserUsecase = new PostUserUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
  jwt,
  emailHandler,
});
const makePutUserUsecase = new PutUserUsecase().init({
  makeUserDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
});

export { makeGetUserUsecase, makePostUserUsecase, makePutUserUsecase };
