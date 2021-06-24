import jwt from 'jsonwebtoken';
import { GetUserUsecase } from './getUserUsecase';
import { CreateUserUsecase } from './createUserUsecase';
import { EditUserUsecase } from './editUserUsecase';
import { emailHandler } from '../../utils/email/emailHandler';
import { makeUserDbService } from '../../dataAccess/services/user';
import { makeMinuteBankDbService } from '../../dataAccess/services/minuteBank';
import { makePackageDbService } from '../../dataAccess/services/package';
import { makePackageTransactionDbService } from '../../dataAccess/services/packageTransaction';
import { makeTeacherBalanceDbService } from '../../dataAccess/services/teacherBalance';
import { makeTeacherDbService } from '../../dataAccess/services/teacher';
import { makeUserEntity } from '../../entities/user';

const makeGetUserUsecase = new GetUserUsecase().init({ makeUserDbService });

const makeCreateUserUsecase = new CreateUserUsecase().init({
  makeUserDbService,
  makeUserEntity,
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
