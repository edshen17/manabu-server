import axios from 'axios';
import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { GetExchangeRatesUsecase } from './getExchangeRatesUsecase';

const makeGetExchangeRatesUsecase = new GetExchangeRatesUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
  makeCacheDbService,
  axios,
});

export { makeGetExchangeRatesUsecase };
