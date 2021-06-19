import { makeUserDbService } from '../../dataAccess/services/user';
import { MinuteBankEntity } from './minuteBankEntity';

const makeMinuteBankEntity = new MinuteBankEntity().init({
  makeUserDbService,
});

export { makeMinuteBankEntity };
