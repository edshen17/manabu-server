import { makeUserDbService } from '../../dataAccess/services/usersDb';
import { MinuteBankEntity } from './minuteBankEntity';

const makeMinuteBankEntity = new MinuteBankEntity().init({
  makeUserDbService,
});

export { makeMinuteBankEntity };
