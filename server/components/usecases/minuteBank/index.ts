import { makeMinuteBankDbService } from '../../dataAccess/services/minuteBanksDb';
import { GetMinuteBankUsecase } from './getMinuteBankUsecase';

const makeGetMinuteBankUsecase = new GetMinuteBankUsecase().init({
  makeMinuteBankDbService,
});

export { makeGetMinuteBankUsecase };
