import cloneDeep from 'clone-deep';
import { sign as signJwt } from 'jsonwebtoken';
import { makeUserEntity } from '../../../entities/user';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeTeacherBalanceDbService } from '../../../dataAccess/services/teacherBalance';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makePackageDbService } from '../../../dataAccess/services/package';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { CreateUserUsecase } from './createUserUsecase';
import { makeRedirectUrlBuilder } from '../../utils/redirectUrlBuilder';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makeTeacherBalanceEntity } from '../../../entities/teacherBalance';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makePackageEntity } from '../../../entities/package';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeUserQueryValidator } from '../../../validators/user/query';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import deepEqual from 'deep-equal';
import { makeEmailHandler } from '../../utils/emailHandler';

const makeCreateUserUsecase = new CreateUserUsecase().init({
  makeUserEntity,
  makePackageEntity,
  makePackageTransactionEntity,
  makeTeacherEntity,
  makeTeacherBalanceEntity,
  makeDbService: makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeTeacherBalanceDbService,
  makeCacheDbService,
  signJwt,
  makeEmailHandler,
  makeRedirectUrlBuilder,
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeUserQueryValidator,
  convertStringToObjectId,
  deepEqual,
});

export { makeCreateUserUsecase };
