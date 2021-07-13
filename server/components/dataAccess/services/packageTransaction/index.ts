import { makeDb } from '../..';
import { PackageTransaction } from '../../../../models/PackageTransaction';
import { PackageTransactionDbService } from './packageTransactionDbService';
import cloneDeep from 'clone-deep';
import { makeAppointmentDbService } from '../appointment';
import { makeLocationDataHandler } from '../../../entities/utils/locationDataHandler';
import { User } from '../../../../models/User';

const makePackageTransactionDbService = new PackageTransactionDbService().init({
  makeDb,
  dbModel: PackageTransaction,
  cloneDeep,
  makeAppointmentDbService,
  makeLocationDataHandler,
  userModel: User,
});

export { makePackageTransactionDbService };
