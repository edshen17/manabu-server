import { Dayjs } from 'dayjs';
import { ClientSession } from 'mongoose';
import { DEFAULT_CURRENCY } from '../../../../constants';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { BalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  BalanceTransactionEntity,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import {
  PaymentServiceExecutePayoutRes,
  PAYMENT_GATEWAY_NAME,
} from '../../../payment/abstractions/IPaymentService';
import { PaypalPaymentService } from '../../../payment/services/paypal/paypalPaymentService';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';

type OptionalEndPackageTransactionScheduleTaskInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeBalanceTransactionDbService: Promise<BalanceTransactionDbService>;
  makeUserDbService: Promise<UserDbService>;
  makeBalanceTransactionEntity: Promise<BalanceTransactionEntity>;
  makePaypalPaymentService: Promise<PaypalPaymentService>;
};

type GetExpiredPackageTransactionsParams = {
  dbServiceAccessOptions: DbServiceAccessOptions;
  now: Dayjs;
  session: ClientSession;
};

type EndTransactionParams = {
  packageTransaction: PackageTransactionDoc;
  dbServiceAccessOptions: DbServiceAccessOptions;
  session: ClientSession;
};

type EndPackageTransactionScheduleTaskResponse = {
  endedPackageTransactions: PackageTransactionDoc[];
  endedTeacherBalanceResponses: EndTeacherBalanceTransactionRes[];
};

type SendTeacherPayoutRes = PaymentServiceExecutePayoutRes;

type EndTeacherBalanceTransactionRes = {
  debitTeacherBalanceTransaction: BalanceTransactionDoc;
  teacher: JoinedUserDoc;
  executePayoutRes: PaymentServiceExecutePayoutRes;
  creditTeacherPayoutBalanceTransaction: BalanceTransactionDoc;
};
class EndPackageTransactionScheduleTask extends AbstractScheduleTask<
  OptionalEndPackageTransactionScheduleTaskInitParams,
  EndPackageTransactionScheduleTaskResponse
> {
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _balanceTransactionDbService!: BalanceTransactionDbService;
  private _userDbService!: UserDbService;
  private _balanceTransactionEntity!: BalanceTransactionEntity;
  private _paypalPaymentService!: PaypalPaymentService;

  public execute = async (): Promise<EndPackageTransactionScheduleTaskResponse> => {
    const now = this._dayjs();
    const dbServiceAccessOptions =
      this._packageTransactionDbService.getOverrideDbServiceAccessOptions();
    const session = await this._packageTransactionDbService.startSession();
    let endPackageTransactionScheduleTaskRes!: EndPackageTransactionScheduleTaskResponse;
    session.startTransaction();
    try {
      endPackageTransactionScheduleTaskRes = await this._endPackageTransactions({
        now,
        dbServiceAccessOptions,
        session,
      });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
    return endPackageTransactionScheduleTaskRes;
  };

  private _endPackageTransactions = async (props: {
    now: Dayjs;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<EndPackageTransactionScheduleTaskResponse> => {
    const { now, dbServiceAccessOptions, session } = props;
    const expiredPackageTransactions = await this._getExpiredPackageTransactions({
      now,
      dbServiceAccessOptions,
      session,
    });
    const endedPackageTransactions = [];
    const endedTeacherBalanceResponses = [];
    for (const packageTransaction of expiredPackageTransactions) {
      const endedPackageTransaction = await this._endPackageTransaction({
        packageTransaction,
        dbServiceAccessOptions,
        session,
      });
      const endedTeacherBalanceTransactionRes = await this._endTeacherBalanceTransaction({
        packageTransaction,
        dbServiceAccessOptions,
        session,
      });
      endedTeacherBalanceResponses.push(endedTeacherBalanceTransactionRes);
      endedPackageTransactions.push(endedPackageTransaction);
    }
    return { endedPackageTransactions, endedTeacherBalanceResponses };
  };

  private _getExpiredPackageTransactions = async (
    props: GetExpiredPackageTransactionsParams
  ): Promise<PackageTransactionDoc[]> => {
    const { now, dbServiceAccessOptions, session } = props;
    const expiredPackageTransactions = await this._packageTransactionDbService.find({
      dbServiceAccessOptions,
      searchQuery: {
        $and: [
          {
            $or: [
              {
                terminationDate: {
                  $lte: now.toDate(),
                },
              },
              { remainingAppointments: 0 },
            ],
          },
          { isTerminated: false },
        ],
      },
      session,
    });
    return expiredPackageTransactions;
  };

  private _endPackageTransaction = async (
    props: EndTransactionParams
  ): Promise<PackageTransactionDoc> => {
    const { packageTransaction, dbServiceAccessOptions, session } = props;
    const endedPackageTransaction = await this._packageTransactionDbService.findOneAndUpdate({
      dbServiceAccessOptions,
      searchQuery: {
        _id: packageTransaction._id,
      },
      updateQuery: {
        isTerminated: true,
        remainingReschedules: 0,
      },
      session,
    });
    return endedPackageTransaction;
  };

  private _endTeacherBalanceTransaction = async (
    props: EndTransactionParams
  ): Promise<EndTeacherBalanceTransactionRes> => {
    const { packageTransaction, dbServiceAccessOptions, session } = props;
    const debitTeacherBalanceTransaction = await this._editDebitTeacherBalanceTransaction({
      packageTransaction,
      dbServiceAccessOptions,
      session,
    });
    const teacher = await this._editTeacherBalance({
      debitTeacherBalanceTransaction,
      dbServiceAccessOptions,
      session,
    });
    const executePayoutRes = await this._executePayout({
      debitTeacherBalanceTransaction,
      teacher,
      dbServiceAccessOptions,
      session,
    });
    const creditTeacherPayoutBalanceTransaction =
      await this._createCreditTeacherPayoutBalanceTransaction({
        debitTeacherBalanceTransaction,
        dbServiceAccessOptions,
        session,
        executePayoutRes,
      });
    const endTeacherBalanceTransactionRes = {
      debitTeacherBalanceTransaction,
      teacher,
      executePayoutRes,
      creditTeacherPayoutBalanceTransaction,
    };
    return endTeacherBalanceTransactionRes;
  };

  private _editDebitTeacherBalanceTransaction = async (props: {
    packageTransaction: PackageTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }) => {
    const { packageTransaction, dbServiceAccessOptions, session } = props;
    const debitTeacherBalanceTransaction = await this._balanceTransactionDbService.findOneAndUpdate(
      {
        searchQuery: {
          packageTransactionId: packageTransaction._id,
          userId: packageTransaction.hostedById,
        },
        updateQuery: {
          status: BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
        },
        dbServiceAccessOptions,
        session,
      }
    );
    return debitTeacherBalanceTransaction;
  };

  private _createCreditTeacherPayoutBalanceTransaction = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
    executePayoutRes: SendTeacherPayoutRes;
  }): Promise<BalanceTransactionDoc> => {
    const { dbServiceAccessOptions, session, debitTeacherBalanceTransaction, executePayoutRes } =
      props;
    const balanceChange = debitTeacherBalanceTransaction.totalPayment * -1;
    const { userId, currency, packageTransactionId, runningBalance } =
      debitTeacherBalanceTransaction;
    const { id } = executePayoutRes;
    const creditTeacherPayoutBalanceTransactionEntity = await this._balanceTransactionEntity.build({
      userId,
      status: BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
      currency: currency,
      type: BALANCE_TRANSACTION_ENTITY_TYPE.PAYOUT,
      packageTransactionId: packageTransactionId,
      balanceChange,
      processingFee: 0,
      tax: 0,
      runningBalance: {
        currency: runningBalance.currency,
        totalAvailable: runningBalance.totalAvailable + balanceChange,
      },
      paymentData: {
        gateway: PAYMENT_GATEWAY_NAME.PAYPAL,
        id,
      },
    });
    const creditTeacherPayoutBalanceTransaction = await this._balanceTransactionDbService.insert({
      modelToInsert: creditTeacherPayoutBalanceTransactionEntity,
      dbServiceAccessOptions,
      session,
    });
    return creditTeacherPayoutBalanceTransaction;
  };

  private _editTeacherBalance = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<JoinedUserDoc> => {
    const { debitTeacherBalanceTransaction, dbServiceAccessOptions, session } = props;
    const balanceChange = debitTeacherBalanceTransaction.totalPayment * -1;
    const updatedTeacher = await this._userDbService.findOneAndUpdate({
      searchQuery: {
        _id: debitTeacherBalanceTransaction.userId,
      },
      updateQuery: {
        $inc: {
          'balance.totalPending': balanceChange,
          'balance.totalAvailable': balanceChange,
        },
      },
      dbServiceAccessOptions,
      session,
    });
    return updatedTeacher;
  };

  private _executePayout = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    teacher: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<PaymentServiceExecutePayoutRes> => {
    const { debitTeacherBalanceTransaction, teacher } = props;
    const payoutAmount = debitTeacherBalanceTransaction.totalPayment;
    const payoutMessage = `Minato Manabu has sent you ${payoutAmount} ${DEFAULT_CURRENCY} to your PayPal account.`;
    const executePayoutRes = await this._paypalPaymentService.executePayout({
      type: 'email',
      emailData: {
        subject: `${payoutAmount} Lesson Payout - Minato Manabu`,
        message: payoutMessage,
      },
      id: debitTeacherBalanceTransaction._id,
      recipients: [
        {
          note: payoutMessage,
          amount: {
            currency: debitTeacherBalanceTransaction.currency,
            value: payoutAmount,
          },
          receiver: teacher.teacherData!.settings.payoutData.email,
          sender_item_id: debitTeacherBalanceTransaction.packageTransactionId,
        },
      ],
    });
    return executePayoutRes;
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
      makePaypalPaymentService,
    } = optionalScheduleTaskInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._balanceTransactionDbService = await makeBalanceTransactionDbService;
    this._userDbService = await makeUserDbService;
    this._balanceTransactionEntity = await makeBalanceTransactionEntity;
    this._paypalPaymentService = await makePaypalPaymentService;
  };
}

export { EndPackageTransactionScheduleTask };
