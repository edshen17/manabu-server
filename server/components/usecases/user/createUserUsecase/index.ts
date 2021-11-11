import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makePackageDbService } from '../../../dataAccess/services/package';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makePackageEntity } from '../../../entities/package';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makeTeacherEntity } from '../../../entities/teacher';
import { makeUserEntity } from '../../../entities/user';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeUserQueryValidator } from '../../../validators/user/query';
import { makeEmailHandler } from '../../utils/emailHandler';
import { makeJwtHandler } from '../../utils/jwtHandler';
import { makeRedirectUrlBuilder } from '../../utils/redirectUrlBuilder';
import { CreateUserUsecase } from './createUserUsecase';

const makeCreateUserUsecase = new CreateUserUsecase().init({
  makeUserEntity,
  makePackageEntity,
  makePackageTransactionEntity,
  makeTeacherEntity,
  makeDbService: makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeCacheDbService,
  makeJwtHandler,
  makeEmailHandler,
  makeRedirectUrlBuilder,
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeUserQueryValidator,
  convertStringToObjectId,
  deepEqual,
});

export { makeCreateUserUsecase };
