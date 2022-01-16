import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { makeCookieHandler } from '../../utils/cookieHandler';
import { makeJwtHandler } from '../../utils/jwtHandler';
import { GetUserUsecase } from './getUserUsecase';

const makeGetUserUsecase = new GetUserUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
  makeCookieHandler,
  makeJwtHandler,
});

export { makeGetUserUsecase };
