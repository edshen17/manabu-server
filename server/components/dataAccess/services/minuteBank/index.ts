import { makeDb } from '../..';
import { MinuteBank } from '../../../../models/MinuteBank';
import { MinuteBankDbService } from './minuteBankService';

const makeMinuteBankDbService = new MinuteBankDbService().init({
  makeDb,
  dbModel: MinuteBank,
});

export { makeMinuteBankDbService };
