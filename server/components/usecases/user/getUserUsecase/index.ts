import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { GetUserUsecase } from './getUserUsecase';

const makeGetUserUsecase = new GetUserUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetUserUsecase };
