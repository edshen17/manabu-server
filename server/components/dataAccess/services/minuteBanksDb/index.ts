import { makeDb } from '../..';
import { MinuteBank } from '../../../../models/MinuteBank';
import { MinuteBankDbService } from './minuteBanksDb';

const makeMinuteBankDbService = new MinuteBankDbService({ minuteBankDb: MinuteBank }).init({
  makeDb,
});

export { makeMinuteBankDbService };
