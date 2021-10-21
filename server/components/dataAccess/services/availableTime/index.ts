import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { AvailableTime } from '../../../../models/AvailableTime';
import { makeCacheDbService } from '../cache';
import { AvailableTimeDbService } from './availableTimeDbService';

const makeAvailableTimeDbService = new AvailableTimeDbService().init({
  mongoose,
  dbModel: AvailableTime,
  cloneDeep,
  makeCacheDbService,
});

export { makeAvailableTimeDbService };
