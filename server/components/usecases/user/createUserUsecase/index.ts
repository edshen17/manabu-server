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
import { makeRedirectUrlBuilder } from '../../utils/redirectUrlBuilder';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makeTeacherBalanceEntity } from '../../../entities/teacherBalance';
import { makeMinuteBankEntity } from '../../../entities/minuteBank';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makePackageEntity } from '../../../entities/package';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeUserQueryValidator } from '../../../validators/user/query';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCacheDbService } from '../../../dataAccess/services/cache';

const makeCreateUserUsecase = new CreateUserUsecase().init({
  makeUserEntity,
  makePackageEntity,
  makePackageTransactionEntity,
  makeTeacherEntity,
  makeTeacherBalanceEntity,
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeTeacherBalanceDbService,
  makeCacheDbService,
  signJwt,
  emailHandler,
  makeRedirectUrlBuilder,
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeUserQueryValidator,
  convertStringToObjectId,
});

export { makeCreateUserUsecase };
