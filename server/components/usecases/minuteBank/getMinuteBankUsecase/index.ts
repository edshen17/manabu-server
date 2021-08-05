import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeMinuteBankDbService } from '../../../dataAccess/services/minuteBank';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { GetMinuteBankUsecase } from './getMinuteBankUsecase';

const makeGetMinuteBankUsecase = new GetMinuteBankUsecase().init({
  makeDbService: makeMinuteBankDbService,
  makeQueryValidator: makeBaseQueryValidator,
  makeParamsValidator: makeBaseParamsValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetMinuteBankUsecase };
