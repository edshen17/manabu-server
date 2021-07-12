import { compareSync as comparePassword } from 'bcryptjs';
import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { User } from '../../../../models/User';
import { makeMinuteBankDbService } from '../minuteBank';
import { makePackageDbService } from '../package';
import { makePackageTransactionDbService } from '../packageTransaction';
import { makeTeacherDbService } from '../teacher';
import { UserDbService } from './userDbService';

const makeUserDbService = new UserDbService().init({
  makeDb,
  dbModel: User,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  comparePassword,
  cloneDeep,
  makeMinuteBankDbService,
});

export { makeUserDbService };
