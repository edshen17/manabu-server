import cloneDeep from 'clone-deep';
import { sign as signJwt } from 'jsonwebtoken';
import { makeUserEntity } from '../../../entities/user';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeTeacherBalanceDbService } from '../../../dataAccess/services/teacherBalance';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makePackageDbService } from '../../../dataAccess/services/package';
import { makeMinuteBankDbService } from '../../../dataAccess/services/minuteBank';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { emailHandler } from '../../utils/emailHandler/emailHandler';
import { CreateUserUsecase } from './createUserUsecase';
import { makeRedirectPathBuilder } from '../../utils/redirectPathBuilder';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makeTeacherBalanceEntity } from '../../../entities/teacherBalance';
import { makeMinuteBankEntity } from '../../../entities/minuteBank';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makePackageEntity } from '../../../entities/package';

const makeCreateUserUsecase = new CreateUserUsecase().init({
  makeUserEntity,
  makePackageEntity,
  makePackageTransactionEntity,
  makeMinuteBankEntity,
  makeTeacherEntity,
  makeTeacherBalanceEntity,
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
  signJwt,
  emailHandler,
  makeRedirectPathBuilder,
  cloneDeep,
});

export { makeCreateUserUsecase };
