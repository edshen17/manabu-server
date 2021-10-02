import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeStubDbService } from '../../../dataAccess/services/stub';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeExchangeRateHandler } from '../../utils/exchangeRateHandler';
import { GetExchangeRatesUsecase } from './getExchangeRatesUsecase';

const makeGetExchangeRatesUsecase = new GetExchangeRatesUsecase().init({
  makeDbService: makeStubDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
  makeExchangeRateHandler,
});

export { makeGetExchangeRatesUsecase };
