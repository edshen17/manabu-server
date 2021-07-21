import { compareSync as comparePassword } from 'bcryptjs';
import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { User } from '../../../../models/User';
import { makeMinuteBankDbService } from '../minuteBank';
import { makePackageTransactionDbService } from '../packageTransaction';
import { UserDbService } from './userDbService';

const makeUserDbService = new UserDbService().init({
  makeDb,
  dbModel: User,
  makePackageTransactionDbService,
  comparePassword,
  cloneDeep,
  makeMinuteBankDbService,
});

export { makeUserDbService };
