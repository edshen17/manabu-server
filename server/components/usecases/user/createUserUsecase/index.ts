import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeGraphDbService } from '../../../dataAccess/services/graph';
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
import { makeCookieHandler } from '../../utils/cookieHandler';
import { makeEmailHandler } from '../../utils/emailHandler';
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
  makeEmailHandler,
  makeRedirectUrlBuilder,
  makeGraphDbService,
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeUserQueryValidator,
  convertStringToObjectId,
  deepEqual,
  makeCookieHandler,
});

export { makeCreateUserUsecase };
