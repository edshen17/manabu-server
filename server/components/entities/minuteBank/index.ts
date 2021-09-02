import { makeMinuteBankEntityValidator } from '../../validators/minuteBank/entity';
import { MinuteBankEntity } from './minuteBankEntity';

const makeMinuteBankEntity = new MinuteBankEntity().init({
  makeEntityValidator: makeMinuteBankEntityValidator,
});

export { makeMinuteBankEntity };
