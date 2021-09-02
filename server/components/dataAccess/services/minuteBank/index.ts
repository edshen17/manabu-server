import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { MinuteBank } from '../../../../models/MinuteBank';
import { makeCacheDbService } from '../cache';
import { makeUserDbService } from '../user';
import { MinuteBankDbService } from './minuteBankDbService';

const makeMinuteBankDbService = new MinuteBankDbService().init({
  makeDb,
  dbModel: MinuteBank,
  cloneDeep,
  makeUserDbService,
  makeCacheDbService,
});

export { makeMinuteBankDbService };
