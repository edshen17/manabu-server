import { Dayjs } from 'dayjs';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { BalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  BalanceTransactionEntity,
  BALANCE_TRANSACTION_ENTITY_STATUS,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';

type OptionalEndPackageTransactionScheduleTaskInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeBalanceTransactionDbService: Promise<BalanceTransactionDbService>;
  makeUserDbService: Promise<UserDbService>;
  makeBalanceTransactionEntity: Promise<BalanceTransactionEntity>;
};

type GetExpiredPackageTransactionsParams = {
  dbServiceAccessOptions: DbServiceAccessOptions;
  now: Dayjs;
};

type EndTransactionParams = {
  packageTransaction: PackageTransactionDoc;
  dbServiceAccessOptions: DbServiceAccessOptions;
};

class EndPackageTransactionScheduleTask extends AbstractScheduleTask<OptionalEndPackageTransactionScheduleTaskInitParams> {
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _balanceTransactionDbService!: BalanceTransactionDbService;
  private _userDbService!: UserDbService;
  private _balanceTransactionEntity!: BalanceTransactionEntity;

  public execute = async (): Promise<void> => {
    const now = this._dayjs();
    const dbServiceAccessOptions =
      this._packageTransactionDbService.getBaseDbServiceAccessOptions();
    //session?
    await this._endPackageTransactions({ now, dbServiceAccessOptions });
  };

  private _endPackageTransactions = async (props: {
    now: Dayjs;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { now, dbServiceAccessOptions } = props;
    const expiredPackageTransactions = await this._getExpiredPackageTransactions({
      now,
      dbServiceAccessOptions,
    });
    for (const packageTransaction of expiredPackageTransactions) {
      await this._endPackageTransaction({ packageTransaction, dbServiceAccessOptions });
      await this._endTeacherBalanceTransaction({ packageTransaction, dbServiceAccessOptions });
    }
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

  private _endPackageTransaction = async (props: EndTransactionParams) => {
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

  private _endTeacherBalanceTransaction = async (props: EndTransactionParams): Promise<void> => {
    const { packageTransaction, dbServiceAccessOptions } = props;
    const teacherPayoutBalanceTransaction =
      await this._balanceTransactionDbService.findOneAndUpdate({
        searchQuery: {
          packageTransactionId: packageTransaction._id,
        },
        updateQuery: {
          status: BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
        },
        dbServiceAccessOptions,
      });
    // create balance transaction w/o paymentdata, then on payout update
    // await this._editTeacherBalance({ teacherPayoutBalanceTransaction, dbServiceAccessOptions });
    // change user balance? subtract pending, add available? total same
    // subtract available, subtract total
    //payout
  };

  private _editTeacherBalance = async (props: {
    teacherPayoutBalanceTransaction: BalanceTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { teacherPayoutBalanceTransaction, dbServiceAccessOptions } = props;
    const teacherBalanceChange = teacherPayoutBalanceTransaction.totalPayment * -1;
    const updatedTeacher = await this._userDbService.findOneAndUpdate({
      searchQuery: {
        _id: teacherPayoutBalanceTransaction.userId,
      },
      updateQuery: {
        $inc: {
          'balance.totalPending': teacherBalanceChange,
          'balance.totalAvailable': teacherBalanceChange,
        },
      },
      dbServiceAccessOptions,
    });
  };

  protected _initTemplate = async (
    optionalScheduleTaskInitParams: Omit<
      ScheduleTaskInitParams<OptionalEndPackageTransactionScheduleTaskInitParams>,
      'dayjs'
    >
  ): Promise<void> => {
    const {
      makePackageTransactionDbService,
      makeBalanceTransactionDbService,
      makeUserDbService,
      makeBalanceTransactionEntity,
    } = optionalScheduleTaskInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._balanceTransactionDbService = await makeBalanceTransactionDbService;
    this._userDbService = await makeUserDbService;
    this._balanceTransactionEntity = await makeBalanceTransactionEntity;
  };
}

export { EndPackageTransactionScheduleTask };
