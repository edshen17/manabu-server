import dayjs from 'dayjs';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { EndPackageTransactionScheduleTask } from './endPackageTransactionScheduleTask';

const makeEndPackageTransactionScheduleTask = new EndPackageTransactionScheduleTask().init({
  dayjs,
  makePackageTransactionDbService,
});

export { makeEndPackageTransactionScheduleTask };
