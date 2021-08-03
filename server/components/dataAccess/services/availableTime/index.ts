import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { AvailableTime } from '../../../../models/AvailableTime';
import { makeCacheDbService } from '../cache';
import { AvailableTimeDbService } from './availableTimeDbService';

const makeAvailableTimeDbService = new AvailableTimeDbService().init({
  makeDb,
  dbModel: AvailableTime,
  cloneDeep,
  makeCacheDbService,
});

export { makeAvailableTimeDbService };
