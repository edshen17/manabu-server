import { makeDb } from '../..';
import { MinuteBank } from '../../../../models/MinuteBank';
import { MinuteBankDbService } from './minuteBankService';
import cloneDeep from 'clone-deep';

const makeMinuteBankDbService = new MinuteBankDbService().init({
  makeDb,
  dbModel: MinuteBank,
  cloneDeep,
});

export { makeMinuteBankDbService };
