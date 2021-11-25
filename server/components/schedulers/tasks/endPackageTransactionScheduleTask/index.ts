import dayjs from 'dayjs';
import { makeBalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBalanceTransactionEntity } from '../../../entities/balanceTransaction';
import { makePaypalPaymentService } from '../../../payment/services/paypal';
import { EndPackageTransactionScheduleTask } from './endPackageTransactionScheduleTask';

const makeEndPackageTransactionScheduleTask = new EndPackageTransactionScheduleTask().init({
  dayjs,
  makePackageTransactionDbService,
  makeUserDbService,
  makeBalanceTransactionDbService,
  makeBalanceTransactionEntity,
  makePaypalPaymentService,
});

export { makeEndPackageTransactionScheduleTask };
