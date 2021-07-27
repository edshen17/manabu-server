import { makeDb } from '../..';
import { MinuteBank } from '../../../../models/MinuteBank';
import { MinuteBankDbService } from './minuteBankDbService';
import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../user';

const makeMinuteBankDbService = new MinuteBankDbService().init({
  makeDb,
  dbModel: MinuteBank,
  cloneDeep,
  makeUserDbService,
});

export { makeMinuteBankDbService };
