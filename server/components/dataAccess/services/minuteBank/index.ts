import { makeDb } from '../..';
import { MinuteBank } from '../../../../models/MinuteBank';
import { MinuteBankDbService } from './minuteBankService';

const makeMinuteBankDbService = new MinuteBankDbService({ minuteBankDb: MinuteBank }).init({
  makeDb,
});

export { makeMinuteBankDbService };
