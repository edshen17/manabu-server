import { compareSync as comparePassword } from 'bcryptjs';
import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { User } from '../../../../models/User';
import { makeCacheDbService } from '../cache';
import { UserDbService } from './userDbService';

const makeUserDbService = new UserDbService().init({
  makeDb,
  dbModel: User,
  comparePassword,
  cloneDeep,
  makeCacheDbService,
});

export { makeUserDbService };
