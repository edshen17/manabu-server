import fs from 'fs';
import { DaijirinParser } from './daijirinParser';

const makeDaijirinParser = new DaijirinParser().init({
  fs,
});

export { makeDaijirinParser };
