import jwt from 'jsonwebtoken';
import { makeUserEntity } from '../../../entities/user';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeTeacherBalanceDbService } from '../../../dataAccess/services/teacherBalance';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makePackageDbService } from '../../../dataAccess/services/package';
import { makeMinuteBankDbService } from '../../../dataAccess/services/minuteBank';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { emailHandler } from '../../../utils/email/emailHandler';
import { CreateUserUsecase } from './createUserUsecase';

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

export { makeCreateUserUsecase };
