import { makeDb } from '../..';
import { MinuteBank } from '../../../../models/MinuteBank';
import { MinuteBankDbService } from './minuteBankDbService';
import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../user';
import { makeCacheDbService } from '../cache';

const makeMinuteBankDbService = new MinuteBankDbService().init({
  makeDb,
  dbModel: MinuteBank,
  cloneDeep,
  makeUserDbService,
  makeCacheDbService,
});

export { makeMinuteBankDbService };
