import { makeMinuteBankDbService } from '../../dataAccess/index';
import { GetMinuteBankUsecase } from './getMinuteBankUsecase';

const makeGetMinuteBankUsecase = new GetMinuteBankUsecase().init({
  makeMinuteBankDbService,
});

export { makeGetMinuteBankUsecase };
