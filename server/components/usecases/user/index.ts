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
import { PostCreateUserUsecase } from './postCreateUserUsecase';
import { PutEditUserUsecase } from './putEditUserUsecase';
import { emailHandler } from '../../utils/email/emailHandler';

const makeGetUserUsecase = new GetUserUsecase().init({ makeUserDbService });

const makePostCreateUserUsecase = new PostCreateUserUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
  jwt,
  emailHandler,
});

const makePutEditUserUsecase = new PutEditUserUsecase().init({
  makeUserDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
});

export { makeGetUserUsecase, makePostCreateUserUsecase, makePutEditUserUsecase };
