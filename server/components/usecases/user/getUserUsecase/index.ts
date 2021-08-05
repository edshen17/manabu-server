import { GetUserUsecase } from './getUserUsecase';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import cloneDeep from 'clone-deep';

const makeGetUserUsecase = new GetUserUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
});

export { makeGetUserUsecase };
