import fs from 'fs';
import { makeJsonDbService } from '../../dataAccess/services/json';
import { DaijirinParser } from './daijirinParser';

const makeDaijirinParser = new DaijirinParser().init({
  fs,
  makeJsonDbService,
});

export { makeDaijirinParser };
