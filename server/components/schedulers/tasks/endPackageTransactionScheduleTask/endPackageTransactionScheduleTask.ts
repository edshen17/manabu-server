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
  BalanceTransactionEntityBuildResponse,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import {
  PaymentServiceExecutePayoutResponse,
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
  cloneDeep: any;
  currency: any;
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
  endedTeacherBalanceResponses: EndTeacherBalanceTransactionResponse[];
};

type SendTeacherPayoutResponse = PaymentServiceExecutePayoutResponse;

type EndTeacherBalanceTransactionResponse = {
  debitTeacherBalanceTransaction: BalanceTransactionDoc;
  teacher: JoinedUserDoc;
  executePayoutRes: SendTeacherPayoutResponse;
  creditTeacherPayoutBalanceTransactions: BalanceTransactionDoc[];
};

type CreateCreditTeacherPayoutBalanceTransactionEntitiesParams = {
  debitTeacherBalanceTransaction: BalanceTransactionDoc;
  executePayoutRes: PaymentServiceExecutePayoutResponse;
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
  private _cloneDeep: any;
  private _currency: any;

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
      const endedTeacherBalanceTransactionRes = await this._endTeacherBalanceTransaction({
        packageTransaction,
        dbServiceAccessOptions,
        session,
      });
      const endedPackageTransaction = await this._endPackageTransaction({
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
        remainingAppointments: 0,
        remainingReschedules: 0,
      },
      session,
    });
    return endedPackageTransaction;
  };

  private _endTeacherBalanceTransaction = async (
    props: EndTransactionParams
  ): Promise<EndTeacherBalanceTransactionResponse> => {
    const { packageTransaction, dbServiceAccessOptions, session } = props;
    const debitTeacherBalanceTransaction = await this._closeDebitTeacherBalanceTransaction({
      packageTransaction,
      dbServiceAccessOptions,
      session,
    });
    let teacher = await this._userDbService.findById({
      _id: packageTransaction.hostedById,
      dbServiceAccessOptions,
      session,
    });
    const executePayoutRes = await this._executePayout({
      debitTeacherBalanceTransaction,
      teacher,
      dbServiceAccessOptions,
      session,
    });
    const creditTeacherPayoutBalanceTransactions =
      await this._createCreditTeacherPayoutBalanceTransactions({
        debitTeacherBalanceTransaction,
        dbServiceAccessOptions,
        session,
        executePayoutRes,
      });
    teacher = await this._editTeacherBalance({
      debitTeacherBalanceTransaction,
      creditTeacherPayoutBalanceTransactions,
      dbServiceAccessOptions,
      session,
    });
    const endTeacherBalanceTransactionRes = {
      debitTeacherBalanceTransaction,
      teacher,
      executePayoutRes,
      creditTeacherPayoutBalanceTransactions,
    };
    return endTeacherBalanceTransactionRes;
  };

  private _closeDebitTeacherBalanceTransaction = async (props: {
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
          status: BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
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

  private _createCreditTeacherPayoutBalanceTransactions = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
    executePayoutRes: SendTeacherPayoutResponse;
  }): Promise<BalanceTransactionDoc[]> => {
    const { dbServiceAccessOptions, session, debitTeacherBalanceTransaction, executePayoutRes } =
      props;
    const creditTeacherPayoutBalanceTransactionEntity =
      await this._createCreditTeacherPayoutBalanceTransactionEntities({
        debitTeacherBalanceTransaction,
        executePayoutRes,
      });
    const creditTeacherPayoutBalanceTransaction =
      await this._balanceTransactionDbService.insertMany({
        modelToInsert: creditTeacherPayoutBalanceTransactionEntity,
        dbServiceAccessOptions,
        session,
      });
    return creditTeacherPayoutBalanceTransaction;
  };

  private _createCreditTeacherPayoutBalanceTransactionEntities = async (
    props: CreateCreditTeacherPayoutBalanceTransactionEntitiesParams
  ): Promise<BalanceTransactionEntityBuildResponse[]> => {
    const { debitTeacherBalanceTransaction } = props;
    const { balanceChange, hasRemainingAppointments } = await this._getTeacherPayoutData(
      debitTeacherBalanceTransaction
    );
    const creditTeacherPayoutBalanceTransactionEntities = [];
    const earnedCreditTeacherPayoutBalanceTransactionEntity =
      await this._createEarnedCreditTeacherPayoutBalanceTransactionEntity({
        ...props,
        balanceChange,
      });
    creditTeacherPayoutBalanceTransactionEntities.push(
      earnedCreditTeacherPayoutBalanceTransactionEntity
    );
    if (hasRemainingAppointments) {
      const unearnedCreditTeacherPayoutBalanceTransactionEntity =
        await this._createUnearnedCreditTeacherPayoutBalanceTransactionEntity({
          debitTeacherBalanceTransaction,
          earnedCreditTeacherPayoutBalanceTransactionEntity,
        });
      creditTeacherPayoutBalanceTransactionEntities.push(
        unearnedCreditTeacherPayoutBalanceTransactionEntity
      );
    }
    return creditTeacherPayoutBalanceTransactionEntities;
  };

  private _createEarnedCreditTeacherPayoutBalanceTransactionEntity = async (
    props: CreateCreditTeacherPayoutBalanceTransactionEntitiesParams & { balanceChange: number }
  ): Promise<BalanceTransactionEntityBuildResponse> => {
    const { debitTeacherBalanceTransaction, executePayoutRes, balanceChange } = props;
    const { userId, currency, packageTransactionId, runningBalance } =
      debitTeacherBalanceTransaction;
    const { id } = executePayoutRes;
    const earnedCreditTeacherPayoutBalanceTransactionEntity =
      await this._balanceTransactionEntity.build({
        userId,
        status: BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
        currency,
        type: BALANCE_TRANSACTION_ENTITY_TYPE.PAYOUT,
        packageTransactionId: packageTransactionId,
        balanceChange,
        processingFee: 0,
        tax: 0,
        runningBalance: {
          totalAvailable: runningBalance.totalAvailable + balanceChange,
          currency: runningBalance.currency,
        },
        paymentData: {
          gateway: PAYMENT_GATEWAY_NAME.PAYPAL,
          id,
        },
      });
    return earnedCreditTeacherPayoutBalanceTransactionEntity;
  };

  private _createUnearnedCreditTeacherPayoutBalanceTransactionEntity = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    earnedCreditTeacherPayoutBalanceTransactionEntity: BalanceTransactionEntityBuildResponse;
  }): Promise<BalanceTransactionEntityBuildResponse> => {
    const { debitTeacherBalanceTransaction, earnedCreditTeacherPayoutBalanceTransactionEntity } =
      props;
    const { userId, currency, packageTransactionId, runningBalance } =
      earnedCreditTeacherPayoutBalanceTransactionEntity;
    let balanceChange =
      (debitTeacherBalanceTransaction.totalPayment +
        earnedCreditTeacherPayoutBalanceTransactionEntity.balanceChange) *
      -1;
    balanceChange = this._currency(balanceChange).value; // need to convert to currency format, otherwise rounding error/neg totalAvailable
    const unearnedCreditTeacherPayoutBalanceTransactionEntity =
      await this._balanceTransactionEntity.build({
        userId,
        status: BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
        currency,
        type: BALANCE_TRANSACTION_ENTITY_TYPE.EXPIRED,
        packageTransactionId,
        balanceChange,
        processingFee: 0,
        tax: 0,
        runningBalance: {
          totalAvailable: runningBalance.totalAvailable + balanceChange,
          currency: runningBalance.currency,
        },
      });
    return unearnedCreditTeacherPayoutBalanceTransactionEntity;
  };

  private _getTeacherPayoutData = async (debitTeacherBalanceTransaction: BalanceTransactionDoc) => {
    const packageTransactionData = debitTeacherBalanceTransaction.packageTransactionData;
    const packageData = packageTransactionData.packageData;
    const remainingAppointments = packageTransactionData.remainingAppointments;
    const hasRemainingAppointments = remainingAppointments > 0;
    const packageLessonAmount = packageData.lessonAmount;
    const completedLessons = packageLessonAmount - remainingAppointments;
    const balanceChange =
      debitTeacherBalanceTransaction.totalPayment * (completedLessons / packageLessonAmount);
    const payoutData = {
      balanceChange: balanceChange * -1,
      hasRemainingAppointments,
    };
    return payoutData;
  };

  private _editTeacherBalance = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    creditTeacherPayoutBalanceTransactions: BalanceTransactionDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<JoinedUserDoc> => {
    const {
      debitTeacherBalanceTransaction,
      creditTeacherPayoutBalanceTransactions,
      dbServiceAccessOptions,
      session,
    } = props;
    const payoutBalanceTransaction = creditTeacherPayoutBalanceTransactions.find(
      (balanceTransaction) => {
        return balanceTransaction.type == BALANCE_TRANSACTION_ENTITY_TYPE.PAYOUT;
      }
    )!;
    const balanceChange =
      (debitTeacherBalanceTransaction.totalPayment - payoutBalanceTransaction.totalPayment) * -1;
    const updatedTeacher = await this._userDbService.findOneAndUpdate({
      searchQuery: {
        _id: payoutBalanceTransaction.userId,
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
  }): Promise<PaymentServiceExecutePayoutResponse> => {
    const { debitTeacherBalanceTransaction, teacher } = props;
    const { balanceChange } = await this._getTeacherPayoutData(debitTeacherBalanceTransaction);
    const payoutAmount = this._currency(balanceChange).multiply(-1);
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
      cloneDeep,
      currency,
    } = optionalScheduleTaskInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._balanceTransactionDbService = await makeBalanceTransactionDbService;
    this._userDbService = await makeUserDbService;
    this._balanceTransactionEntity = await makeBalanceTransactionEntity;
    this._paypalPaymentService = await makePaypalPaymentService;
    this._cloneDeep = cloneDeep;
    this._currency = currency;
  };
}

export { EndPackageTransactionScheduleTask };
