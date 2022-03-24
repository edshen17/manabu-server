import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeContentDbService } from '../../../dataAccess/services/content';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeContentParamsValidator } from '../../../validators/content/params';
import { GetContentUsecase } from './getContentUsecase';

const makeGetContentUsecase = new GetContentUsecase().init({
  makeDbService: makeContentDbService,
  makeParamsValidator: makeContentParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetContentUsecase };
