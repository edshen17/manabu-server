import { makeMinuteBankDbService } from '../../dataAccess/services/minuteBank';
import { GetMinuteBankUsecase } from './getMinuteBankUsecase';

const makeGetMinuteBankUsecase = new GetMinuteBankUsecase().init({
  makeMinuteBankDbService,
});

export { makeGetMinuteBankUsecase };
