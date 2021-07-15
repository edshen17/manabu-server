import { makeUserDbService } from '../../dataAccess/services/user';
import { MinuteBankEntity } from './minuteBankEntity';
import { makeMinuteBankEntityValidator } from '../../validators/minuteBank/entity';

const makeMinuteBankEntity = new MinuteBankEntity().init({
  makeUserDbService,
  makeEntityValidator: makeMinuteBankEntityValidator,
});

export { makeMinuteBankEntity };
