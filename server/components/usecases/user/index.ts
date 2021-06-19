import jwt from 'jsonwebtoken';
import { makeTeacherDbService } from '../../dataAccess/index';
import { GetUserUsecase } from './getUserUsecase';
import { CreateUserUsecase } from './createUserUsecase';
import { EditUserUsecase } from './editUserUsecase';
import { emailHandler } from '../../utils/email/emailHandler';
import { makeUserDbService } from '../../dataAccess/services/user';
import { makeMinuteBankDbService } from '../../dataAccess/services/minuteBank';
import { makePackageDbService } from '../../dataAccess/services/package';
import { makePackageTransactionDbService } from '../../dataAccess/services/packageTransaction';
import { makeTeacherBalanceDbService } from '../../dataAccess/services/teacherBalance';

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
