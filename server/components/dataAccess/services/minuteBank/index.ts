import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { MinuteBank } from '../../../../models/MinuteBank';
import { makeCacheDbService } from '../cache';
import { makeUserDbService } from '../user';
import { MinuteBankDbService } from './minuteBankDbService';

const makeMinuteBankDbService = new MinuteBankDbService().init({
  mongoose,
  dbModel: MinuteBank,
  cloneDeep,
  makeUserDbService,
  makeCacheDbService,
});

export { makeMinuteBankDbService };
