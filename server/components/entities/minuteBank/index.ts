import { MinuteBankEntity } from './minuteBankEntity';
import { makeMinuteBankEntityValidator } from '../../validators/minuteBank/entity';

const makeMinuteBankEntity = new MinuteBankEntity().init({
  makeEntityValidator: makeMinuteBankEntityValidator,
});

export { makeMinuteBankEntity };
