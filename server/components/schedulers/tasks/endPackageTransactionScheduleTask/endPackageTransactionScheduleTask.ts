import { Dayjs } from 'dayjs';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';

type OptionalEndPackageTransactionScheduleTaskInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

type GetExpiredPackageTransactionsParams = {
  dbServiceAccessOptions: DbServiceAccessOptions;
  now: Dayjs;
};

class EndPackageTransactionScheduleTask extends AbstractScheduleTask<OptionalEndPackageTransactionScheduleTaskInitParams> {
  private _packageTransactionDbService!: PackageTransactionDbService;

  public execute = async (): Promise<void> => {
    const now = this._dayjs();
    const dbServiceAccessOptions =
      this._packageTransactionDbService.getBaseDbServiceAccessOptions();
    const expiredPackageTransactions = await this._getExpiredPackageTransactions({
      now,
      dbServiceAccessOptions,
    });
    for (const packageTransaction of expiredPackageTransactions) {
      await this._endPackageTransaction({ packageTransaction, dbServiceAccessOptions });
    }
    // payout to teacher
  };

  private _getExpiredPackageTransactions = async (
    props: GetExpiredPackageTransactionsParams
  ): Promise<PackageTransactionDoc[]> => {
    const { now, dbServiceAccessOptions } = props;
    const confirmedAppointments = await this._packageTransactionDbService.find({
      dbServiceAccessOptions,
      searchQuery: {
        endDate: {
          $lte: now.toDate(),
        },
        isTerminated: false,
      },
    });
    return confirmedAppointments;
  };

  private _endPackageTransaction = async (props: {
    packageTransaction: PackageTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { packageTransaction, dbServiceAccessOptions } = props;
    await this._packageTransactionDbService.findOneAndUpdate({
      dbServiceAccessOptions,
      searchQuery: {
        _id: packageTransaction._id,
      },
      updateQuery: {
        isTerminated: true,
        remainingAppointments: 0,
        remainingReschedules: 0,
      },
    });
  };

  protected _initTemplate = async (
    optionalScheduleTaskInitParams: Omit<
      ScheduleTaskInitParams<OptionalEndPackageTransactionScheduleTaskInitParams>,
      'dayjs'
    >
  ): Promise<void> => {
    const { makePackageTransactionDbService } = optionalScheduleTaskInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
  };
}

export { EndPackageTransactionScheduleTask };
