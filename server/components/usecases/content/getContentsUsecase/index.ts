import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeContentDbService } from '../../../dataAccess/services/content';
import { makeGraphDbService } from '../../../dataAccess/services/graph';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { GetContentsUsecase } from './getContentsUsecase';

const makeGetContentsUsecase = new GetContentsUsecase().init({
  makeDbService: makeContentDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
  makeGraphDbService,
});

export { makeGetContentsUsecase };
