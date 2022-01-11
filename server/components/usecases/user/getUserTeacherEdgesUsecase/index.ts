import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
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
  makeCacheDbService,
});

export { makeGetUserTeacherEdgesUsecase };
