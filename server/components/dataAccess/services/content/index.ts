import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { Content } from '../../../../models/Content';
import { makeCacheDbService } from '../cache';
import { ContentDbService } from './contentDbService';

const makeContentDbService = new ContentDbService().init({
  mongoose,
  dbModel: Content,
  cloneDeep,
  makeCacheDbService,
});

export { makeContentDbService };
