import { Dayjs } from 'dayjs';
import { DEFAULT_CURRENCY, MANABU_ADMIN_ID, PAYOUT_RATE } from '../../../../constants';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { Await } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { BalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import { IncomeReportDbService } from '../../../dataAccess/services/incomeReport/incomeReportDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  BalanceTransactionEntity,
  BalanceTransactionEntityBuildResponse,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { DateRangeKeyHandler } from '../../../entities/utils/dateRangeKeyHandler/dateRangeKeyHandler';
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
  currency: any;
  makeIncomeReportDbService: Promise<IncomeReportDbService>;
  makeDateRangeKeyHandler: DateRangeKeyHandler;
};

type GetExpiredPackageTransactionsParams = {
  dbServiceAccessOptions: DbServiceAccessOptions;
  now: Dayjs;
};

type EndTransactionParams = {
  packageTransaction: PackageTransactionDoc;
  dbServiceAccessOptions: DbServiceAccessOptions;
};

type EndPackageTransactionScheduleTaskResponse = {
  endedPackageTransactions: PackageTransactionDoc[];
  endedTeacherBalanceResponses: EndTeacherBalanceTransactionResponse[];
};

type ExecutePayoutResponse = PaymentServiceExecutePayoutResponse & {
  incomeReport: IncomeReportDoc;
};

type EndTeacherBalanceTransactionResponse = {
  debitTeacherBalanceTransaction: BalanceTransactionDoc;
  teacher: JoinedUserDoc;
  executePayoutRes: ExecutePayoutResponse;
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
  private _currency: any;
  private _incomeReportDbService!: IncomeReportDbService;
  private _dateRangeKeyHandler!: DateRangeKeyHandler;

  public execute = async (): Promise<EndPackageTransactionScheduleTaskResponse> => {
    const now = this._dayjs();
    const dbServiceAccessOptions =
      this._packageTransactionDbService.getOverrideDbServiceAccessOptions();
    const endPackageTransactionScheduleTaskRes = await this._endPackageTransactions({
      now,
      dbServiceAccessOptions,
    });
    return endPackageTransactionScheduleTaskRes;
  };

  private _endPackageTransactions = async (props: {
    now: Dayjs;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<EndPackageTransactionScheduleTaskResponse> => {
    const { now, dbServiceAccessOptions } = props;
    const expiredPackageTransactions = await this._getExpiredPackageTransactions({
      now,
      dbServiceAccessOptions,
    });
    const endedPackageTransactions = [];
    const endedTeacherBalanceResponses = [];
    for (const packageTransaction of expiredPackageTransactions) {
      try {
        const endedPackageTransaction = await this._endPackageTransaction({
          packageTransaction,
          dbServiceAccessOptions,
        });
        const endedTeacherBalanceTransactionRes = await this._endTeacherBalanceTransaction({
          packageTransaction,
          dbServiceAccessOptions,
        });
        endedTeacherBalanceResponses.push(endedTeacherBalanceTransactionRes);
        endedPackageTransactions.push(endedPackageTransaction);
      } catch (err) {
        console.log(err);
        continue;
      }
    }
    return { endedPackageTransactions, endedTeacherBalanceResponses };
  };

  private _getExpiredPackageTransactions = async (
    props: GetExpiredPackageTransactionsParams
  ): Promise<PackageTransactionDoc[]> => {
    const { now, dbServiceAccessOptions } = props;
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
              { status: 'completed' },
            ],
          },
          { isTerminated: false, _id: { $ne: MANABU_ADMIN_ID } },
        ],
      },
    });
    return expiredPackageTransactions;
  };

  private _endPackageTransaction = async (
    props: EndTransactionParams
  ): Promise<PackageTransactionDoc> => {
    const { packageTransaction, dbServiceAccessOptions } = props;
    const endedPackageTransaction = await this._packageTransactionDbService.findOneAndUpdate({
      dbServiceAccessOptions,
      searchQuery: {
        _id: packageTransaction._id,
      },
      updateQuery: {
        isTerminated: true,
        remainingAppointments: 0,
      },
    });
    return endedPackageTransaction;
  };

  private _endTeacherBalanceTransaction = async (
    props: EndTransactionParams
  ): Promise<EndTeacherBalanceTransactionResponse> => {
    const { packageTransaction, dbServiceAccessOptions } = props;
    const debitTeacherBalanceTransaction = await this._closeDebitTeacherBalanceTransaction({
      packageTransaction,
      dbServiceAccessOptions,
    });
    let teacher = await this._userDbService.findById({
      _id: packageTransaction.hostedById,
      dbServiceAccessOptions,
    });
    const executePayoutRes = await this._executePayout({
      debitTeacherBalanceTransaction,
      teacher,
      dbServiceAccessOptions,
    });
    const creditTeacherPayoutBalanceTransactions =
      await this._createCreditTeacherPayoutBalanceTransactions({
        debitTeacherBalanceTransaction,
        dbServiceAccessOptions,
        executePayoutRes,
      });
    teacher = await this._editTeacherBalance({
      debitTeacherBalanceTransaction,
      creditTeacherPayoutBalanceTransactions,
      dbServiceAccessOptions,
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
  }) => {
    const { packageTransaction, dbServiceAccessOptions } = props;
    const debitTeacherBalanceTransaction = await this._balanceTransactionDbService.findOneAndUpdate(
      {
        searchQuery: {
          packageTransactionId: packageTransaction._id,
          type: BALANCE_TRANSACTION_ENTITY_TYPE.PAYOUT,
        },
        updateQuery: {
          status: BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
        },
        dbServiceAccessOptions,
      }
    );
    return debitTeacherBalanceTransaction;
  };

  private _executePayout = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    teacher: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<ExecutePayoutResponse> => {
    const { debitTeacherBalanceTransaction, teacher, dbServiceAccessOptions } = props;
    const { hasRemainingAppointments, balanceChange } = await this._getTeacherPayoutData(
      debitTeacherBalanceTransaction
    );
    const incomeReport = await this._updateIncomeReport({
      debitTeacherBalanceTransaction,
      hasRemainingAppointments,
      balanceChange,
      dbServiceAccessOptions,
    });
    const payoutAmount = this._currency(balanceChange).multiply(-1).value;
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
    return { ...executePayoutRes, incomeReport };
  };

  private _getTeacherPayoutData = async (debitTeacherBalanceTransaction: BalanceTransactionDoc) => {
    const packageTransactionData = debitTeacherBalanceTransaction.packageTransactionData;
    const packageData = packageTransactionData.packageData;
    const remainingAppointments = packageTransactionData.remainingAppointments;
    const hasRemainingAppointments = remainingAppointments > 0;
    const packageLessonAmount = packageData.lessonAmount;
    const completedLessons = packageLessonAmount - remainingAppointments;
    const balanceChange = this._currency(debitTeacherBalanceTransaction.totalPayment).multiply(
      (-1 * completedLessons) / packageLessonAmount
    ).value;
    const payoutData = {
      balanceChange,
      hasRemainingAppointments,
    };
    return payoutData;
  };

  private _updateIncomeReport = async (
    props: Await<ReturnType<EndPackageTransactionScheduleTask['_getTeacherPayoutData']>> & {
      debitTeacherBalanceTransaction: BalanceTransactionDoc;
      dbServiceAccessOptions: DbServiceAccessOptions;
    }
  ): Promise<IncomeReportDoc> => {
    const {
      debitTeacherBalanceTransaction,
      balanceChange,
      hasRemainingAppointments,
      dbServiceAccessOptions,
    } = props;
    const createdDate = debitTeacherBalanceTransaction.createdDate;
    const payoutFee = this._currency(balanceChange).multiply(PAYOUT_RATE).value;
    const additionalEarnings = this._currency(debitTeacherBalanceTransaction.totalPayment).add(
      balanceChange
    ).value;
    const { dateRangeKey } = this._dateRangeKeyHandler.createKey({
      startDate: this._dayjs(createdDate).date(1).hour(0).minute(0).toDate(),
      endDate: this._dayjs(createdDate)
        .date(this._dayjs().daysInMonth())
        .hour(23)
        .minute(59)
        .toDate(),
    });
    let incomeReport: IncomeReportDoc;
    if (hasRemainingAppointments) {
      const expenseDecrease = this._currency(additionalEarnings).add(payoutFee).value;
      incomeReport = await this._incomeReportDbService.findOneAndUpdate({
        searchQuery: {
          dateRangeKey,
        },
        updateQuery: {
          $inc: {
            wageExpense: expenseDecrease,
            totalExpense: expenseDecrease,
            netIncome: expenseDecrease,
          },
        },
        dbServiceAccessOptions,
      });
    } else {
      incomeReport = await this._incomeReportDbService.findOneAndUpdate({
        searchQuery: { dateRangeKey },
        updateQuery: {
          $inc: {
            wageExpense: payoutFee,
            totalExpense: payoutFee,
            netIncome: payoutFee,
          },
        },
        dbServiceAccessOptions,
      });
    }
    return incomeReport;
  };

  private _createCreditTeacherPayoutBalanceTransactions = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    executePayoutRes: ExecutePayoutResponse;
  }): Promise<BalanceTransactionDoc[]> => {
    const { dbServiceAccessOptions, debitTeacherBalanceTransaction, executePayoutRes } = props;
    const creditTeacherPayoutBalanceTransactionEntity =
      await this._createCreditTeacherPayoutBalanceTransactionEntities({
        debitTeacherBalanceTransaction,
        executePayoutRes,
      });
    const creditTeacherPayoutBalanceTransaction =
      await this._balanceTransactionDbService.insertMany({
        modelToInsert: creditTeacherPayoutBalanceTransactionEntity,
        dbServiceAccessOptions,
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
          totalAvailable: this._currency(runningBalance.totalAvailable).add(balanceChange).value,
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
    const balanceChange = this._currency(debitTeacherBalanceTransaction.totalPayment)
      .add(earnedCreditTeacherPayoutBalanceTransactionEntity.balanceChange)
      .multiply(-1).value;
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
          totalAvailable: this._currency(runningBalance.totalAvailable).add(balanceChange).value,
          currency: runningBalance.currency,
        },
      });
    return unearnedCreditTeacherPayoutBalanceTransactionEntity;
  };

  private _editTeacherBalance = async (props: {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    creditTeacherPayoutBalanceTransactions: BalanceTransactionDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const {
      debitTeacherBalanceTransaction,
      creditTeacherPayoutBalanceTransactions,
      dbServiceAccessOptions,
    } = props;
    const payoutBalanceTransaction = creditTeacherPayoutBalanceTransactions.find(
      (balanceTransaction) => {
        return balanceTransaction.type == BALANCE_TRANSACTION_ENTITY_TYPE.PAYOUT;
      }
    )!;
    const balanceChange = this._currency(
      debitTeacherBalanceTransaction.totalPayment - payoutBalanceTransaction.totalPayment
    ).multiply(-1).value;
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
    });
    console.log(updatedTeacher);
    return updatedTeacher;
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
      makeIncomeReportDbService,
      makeDateRangeKeyHandler,
      currency,
    } = optionalScheduleTaskInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._balanceTransactionDbService = await makeBalanceTransactionDbService;
    this._userDbService = await makeUserDbService;
    this._balanceTransactionEntity = await makeBalanceTransactionEntity;
    this._paypalPaymentService = await makePaypalPaymentService;
    this._currency = currency;
    this._incomeReportDbService = await makeIncomeReportDbService;
    this._dateRangeKeyHandler = makeDateRangeKeyHandler;
  };
}

export { EndPackageTransactionScheduleTask };
