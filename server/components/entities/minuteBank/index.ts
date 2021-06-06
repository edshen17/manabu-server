import { makeUserDbService } from '../../dataAccess';
import { MinuteBankEntity } from './minuteBankEntity';

const makeMinuteBankEntity = new MinuteBankEntity().init({
  makeUserDbService,
});

export { makeMinuteBankEntity };
