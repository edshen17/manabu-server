import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import * as wanakana from 'wanakana';
import { makeJsonDbService } from '../../../dataAccess/services/json';
import { makeStubDbService } from '../../../dataAccess/services/stub';
import { makeWordParamsValidator } from '../../../validators/word/params';
import { makeWordQueryValidator } from '../../../validators/word/query';
import { GetWordsUsecase } from './getWordsUsecase';

const makeGetWordsUsecase = new GetWordsUsecase().init({
  makeDbService: makeStubDbService,
  makeParamsValidator: makeWordParamsValidator,
  makeQueryValidator: makeWordQueryValidator,
  cloneDeep,
  deepEqual,
  makeJsonDbService,
  wanakana,
});

export { makeGetWordsUsecase };
