import jwt from 'jsonwebtoken';

import {
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
} from '../../dataAccess/index';
import { GetUserUsecase } from './getUserUsecase';
import { CreateUserUsecase } from './createUserUsecase';
import { EditUserUsecase } from './editUserUsecase';
import { emailHandler } from '../../utils/email/emailHandler';
import { makeUserDbService } from '../../dataAccess/services/usersDb';

const makeGetUserUsecase = new GetUserUsecase().init({ makeUserDbService });

const makeCreateUserUsecase = new CreateUserUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
  jwt,
  emailHandler,
});

const makeEditUserUsecase = new EditUserUsecase().init({
  makeUserDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
});

export { makeGetUserUsecase, makeCreateUserUsecase, makeEditUserUsecase };
