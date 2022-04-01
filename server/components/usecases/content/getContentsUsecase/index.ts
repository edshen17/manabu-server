import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeGraphDbService } from '../../../dataAccess/services/graph';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { GetUserTeacherEdgesUsecase } from './getUserTeacherEdgesUsecase';

const makeGetUserTeacherEdgesUsecase = new GetUserTeacherEdgesUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
  makeGraphDbService,
});

export { makeGetUserTeacherEdgesUsecase };
