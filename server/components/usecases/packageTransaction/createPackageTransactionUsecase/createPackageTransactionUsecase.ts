import { ClientSession } from 'mongoose';
import { DEFAULT_CURRENCY, MANABU_PROCESSING_RATE } from '../../../../constants';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  BalanceTransactionEntityBuildParams,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import {
  PackageTransactionEntity,
  PackageTransactionEntityBuildParams,
} from '../../../entities/packageTransaction/packageTransactionEntity';
import { TEACHER_ENTITY_TYPE } from '../../../entities/teacher/teacherEntity';
import { USER_ENTITY_EMAIL_ALERT } from '../../../entities/user/userEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import {
  CreateBalanceTransactionsUsecase,
  CreateBalanceTransactionsUsecaseResponse,
} from '../../balanceTransaction/createBalanceTransactionsUsecase/createBalanceTransactionsUsecase';
import { CHECKOUT_TOKEN_HASH_KEY } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { CreateIncomeReportUsecase } from '../../incomeReport/createIncomeReportUsecase/createIncomeReportUsecase';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  EmailHandler,
  EMAIL_HANDLER_SENDER_ADDRESS,
  EMAIL_HANDLER_TEMPLATE,
} from '../../utils/emailHandler/emailHandler';
import { ExchangeRateHandler } from '../../utils/exchangeRateHandler/exchangeRateHandler';
import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';

type OptionalCreatePackageTransactionUsecaseInitParams = {
  makeJwtHandler: Promise<JwtHandler>;
  makeCacheDbService: Promise<CacheDbService>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeUserDbService: Promise<UserDbService>;
  makeExchangeRateHandler: Promise<ExchangeRateHandler>;
  makeCreateBalanceTransactionsUsecase: Promise<CreateBalanceTransactionsUsecase>;
  makeCreateIncomeReportUsecase: Promise<CreateIncomeReportUsecase>;
  makeControllerDataBuilder: ControllerDataBuilder;
  makeEmailHandler: Promise<EmailHandler>;
};

type CreatePackageTransactionUsecaseResponse = {
  packageTransaction: PackageTransactionDoc;
  balanceTransactions: BalanceTransactionDoc[];
  incomeReport: IncomeReportDoc;
};

type CreateBalanceTransactionsRouteDataParams = {
  balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
  user: JoinedUserDoc;
  teacher: JoinedUserDoc;
  packageTransaction: PackageTransactionDoc;
};

class CreatePackageTransactionUsecase extends AbstractCreateUsecase<
  OptionalCreatePackageTransactionUsecaseInitParams,
  CreatePackageTransactionUsecaseResponse,
  PackageTransactionDbServiceResponse
> {
  private _jwtHandler!: JwtHandler;
  private _cacheDbService!: CacheDbService;
  private _packageTransactionEntity!: PackageTransactionEntity;
  private _userDbService!: UserDbService;
  private _exchangeRateHandler!: ExchangeRateHandler;
  private _createBalanceTransactionsUsecase!: CreateBalanceTransactionsUsecase;
  private _createIncomeReportUsecase!: CreateIncomeReportUsecase;
  private _controllerDataBuilder!: ControllerDataBuilder;
  private _emailHandler!: EmailHandler;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackageTransactionUsecaseResponse> => {
    const { query, dbServiceAccessOptions } = props;
    const session = await this._dbService.startSession();
    session.startTransaction();
    let usecaseRes!: CreatePackageTransactionUsecaseResponse;
    try {
      usecaseRes = await this._getCreatePackageTransactionUsecaseRes({
        query,
        dbServiceAccessOptions,
        session,
      });
      await this._editTeacherPendingBalance({ usecaseRes, dbServiceAccessOptions, session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
    return usecaseRes;
  };

  private _getCreatePackageTransactionUsecaseRes = async (props: {
    query: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<CreatePackageTransactionUsecaseResponse> => {
    const { query, dbServiceAccessOptions, session } = props;
    const { token, paymentId } = query;
    const verifiedJwt = await this._getVerifiedJwt(token);
    const { packageTransactionEntityBuildParams, balanceTransactionEntityBuildParams } =
      verifiedJwt;
    const packageTransaction = await this._createPackageTransaction({
      packageTransactionEntityBuildParams,
      dbServiceAccessOptions,
      session,
    });
    const { balanceTransactions } = await this._createBalanceTransactions({
      packageTransaction,
      balanceTransactionEntityBuildParams,
      dbServiceAccessOptions,
      paymentId,
      session,
    });
    const incomeReport = await this._createIncomeReport(balanceTransactions);
    const usecaseRes = { packageTransaction, balanceTransactions, incomeReport };
    return usecaseRes;
  };

  private _getVerifiedJwt = async (token: string): Promise<StringKeyObject> => {
    const jwt = await this._cacheDbService.get({
      hashKey: CHECKOUT_TOKEN_HASH_KEY,
      key: token,
    });
    const verifiedJwt = await this._jwtHandler.verify(jwt);
    await this._jwtHandler.blacklist(jwt);
    return verifiedJwt;
  };

  private _createPackageTransaction = async (props: {
    packageTransactionEntityBuildParams: PackageTransactionEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<PackageTransactionDoc> => {
    const { packageTransactionEntityBuildParams, dbServiceAccessOptions, session } = props;
    const packageTransactionEntity = await this._packageTransactionEntity.build(
      packageTransactionEntityBuildParams
    );
    const packageTransaction = await this._dbService.insert({
      modelToInsert: packageTransactionEntity,
      dbServiceAccessOptions,
      session,
    });
    await this._createStudentTeacherEdge(packageTransaction);
    return packageTransaction;
  };

  private _createStudentTeacherEdge = async (
    packageTransaction: PackageTransactionDoc
  ): Promise<void> => {
    await this._cacheDbService.graphQuery(
      `MATCH (teacher:User{ _id: "${packageTransaction.hostedById}" }),
      (student:User{ _id: "${packageTransaction.reservedById}" }) MERGE (teacher)-[r:TEACHES]->(student)`
    );
  };

  private _sendPackageTransactionCreationEmails = (
    balanceTransaction: BalanceTransactionDoc
  ): void => {
    this._sendStudentPackageTransactionCreationEmail(balanceTransaction);
    this._sendTeacherPackageTransactionCreationEmail(balanceTransaction);
  };

  private _sendStudentPackageTransactionCreationEmail = (
    balanceTransaction: BalanceTransactionDoc
  ) => {
    const packageTransaction = balanceTransaction.packageTransactionData;
    this._emailHandler.sendAlertFromUserId({
      userId: packageTransaction.reservedById,
      emailAlertName: USER_ENTITY_EMAIL_ALERT.PACKAGE_TRANSACTION_CREATION,
      from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
      templateName: EMAIL_HANDLER_TEMPLATE.STUDENT_PACKAGE_TRANSACTION_CREATION,
      data: {
        balanceTransaction,
      },
    });
  };

  private _sendTeacherPackageTransactionCreationEmail = (
    balanceTransaction: BalanceTransactionDoc
  ): void => {
    const packageTransaction = balanceTransaction.packageTransactionData;
    this._emailHandler.sendAlertFromUserId({
      userId: packageTransaction.hostedById,
      emailAlertName: USER_ENTITY_EMAIL_ALERT.PACKAGE_TRANSACTION_CREATION,
      from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
      templateName: EMAIL_HANDLER_TEMPLATE.TEACHER_PACKAGE_TRANSACTION_CREATION,
      data: {
        balanceTransaction,
      },
    });
  };

  private _createBalanceTransactions = async (props: {
    packageTransaction: PackageTransactionDoc;
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    paymentId: string;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<CreateBalanceTransactionsUsecaseResponse> => {
    const {
      packageTransaction,
      dbServiceAccessOptions,
      balanceTransactionEntityBuildParams,
      paymentId,
      session,
    } = props;
    const { user, teacher } = await this._getUserDataFromPackageTransaction({
      packageTransaction,
      dbServiceAccessOptions,
      session,
    });
    balanceTransactionEntityBuildParams.packageTransactionId = packageTransaction._id;
    balanceTransactionEntityBuildParams.paymentData!.id = paymentId;
    const createBalanceTransactionsControllerData =
      await this._getBalanceTransactionsControllerData({
        user,
        teacher,
        balanceTransactionEntityBuildParams,
        session,
        packageTransaction,
      });
    const balanceTransactionRes = await this._createBalanceTransactionsUsecase.makeRequest(
      createBalanceTransactionsControllerData
    );
    this._sendPackageTransactionCreationEmails(balanceTransactionRes.balanceTransactions[0]);
    return balanceTransactionRes;
  };

  private _getUserDataFromPackageTransaction = async (props: {
    packageTransaction: PackageTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<{
    user: JoinedUserDoc;
    teacher: JoinedUserDoc;
  }> => {
    const { packageTransaction, dbServiceAccessOptions, session } = props;
    const user = await this._userDbService.findById({
      _id: packageTransaction.reservedById,
      dbServiceAccessOptions,
      session,
    });
    const teacher = await this._userDbService.findById({
      _id: packageTransaction.hostedById,
      dbServiceAccessOptions,
      session,
    });
    return { user, teacher };
  };

  private _getBalanceTransactionsControllerData = async (
    props: CreateBalanceTransactionsRouteDataParams & { session: ClientSession }
  ): Promise<ControllerData> => {
    const { user, session } = props;
    const balanceTransactions = await this._getBalanceTransactionBatchBuildParams({ ...props });
    const currentAPIUser = {
      userId: user._id,
      role: user.role,
    };
    const createBalanceTransactionsRouteData = {
      rawBody: {},
      headers: {},
      params: {},
      body: {
        balanceTransactions,
        session,
      },
      query: {},
      endpointPath: '',
    };
    const createBalanceTransactionsControllerData = this._controllerDataBuilder
      .routeData(createBalanceTransactionsRouteData)
      .currentAPIUser(currentAPIUser)
      .build();
    return createBalanceTransactionsControllerData;
  };

  private _getBalanceTransactionBatchBuildParams = async (
    props: CreateBalanceTransactionsRouteDataParams
  ): Promise<BalanceTransactionEntityBuildParams[]> => {
    const { balanceTransactionEntityBuildParams, user, teacher, packageTransaction } = props;
    const debitBalanceTransactionEntityBuildParams =
      await this._createDebitBalanceTransactionEntityBuildParams({
        balanceTransactionEntityBuildParams,
        user,
      });
    const creditBalanceTransactionBuildParams =
      await this._createCreditBalanceTransactionEntityBuildParams({
        balanceTransactionEntityBuildParams,
        debitBalanceTransactionEntityBuildParams,
        user,
      });
    const debitTeacherBalanceTransactionBuildParams =
      await this._createDebitTeacherBalanceTransactionEntityBuildParams({
        balanceTransactionEntityBuildParams,
        teacher,
        packageTransaction,
      });
    const balanceTransactions = [
      debitBalanceTransactionEntityBuildParams,
      creditBalanceTransactionBuildParams,
      debitTeacherBalanceTransactionBuildParams,
    ];
    return balanceTransactions;
  };

  private _createDebitBalanceTransactionEntityBuildParams = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    user: JoinedUserDoc;
  }): Promise<BalanceTransactionEntityBuildParams> => {
    const { balanceTransactionEntityBuildParams, user } = props;
    const debitBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams =
      this._cloneDeep(balanceTransactionEntityBuildParams);
    debitBalanceTransactionEntityBuildParams.paymentData = undefined;
    debitBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
      await this._exchangeRateHandler.add({
        addend1: {
          amount: debitBalanceTransactionEntityBuildParams.balanceChange,
          sourceCurrency: debitBalanceTransactionEntityBuildParams.currency,
        },
        addend2: {
          amount: user.balance.totalAvailable,
          sourceCurrency: user.balance.currency,
        },
        targetCurrency: DEFAULT_CURRENCY,
      });
    return debitBalanceTransactionEntityBuildParams;
  };

  private _createCreditBalanceTransactionEntityBuildParams = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    debitBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    user: JoinedUserDoc;
  }): Promise<BalanceTransactionEntityBuildParams> => {
    const { balanceTransactionEntityBuildParams, debitBalanceTransactionEntityBuildParams, user } =
      props;
    const creditBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams =
      this._cloneDeep(balanceTransactionEntityBuildParams);
    creditBalanceTransactionEntityBuildParams.balanceChange =
      await this._exchangeRateHandler.multiply({
        multiplicand: {
          amount: debitBalanceTransactionEntityBuildParams.balanceChange,
        },
        multiplier: {
          amount: -1,
        },
        targetCurrency: DEFAULT_CURRENCY,
      });
    creditBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
      user.balance.totalAvailable;
    creditBalanceTransactionEntityBuildParams.processingFee = 0;
    creditBalanceTransactionEntityBuildParams.type =
      BALANCE_TRANSACTION_ENTITY_TYPE.CREDIT_TRANSACTION;
    return creditBalanceTransactionEntityBuildParams;
  };

  private _createDebitTeacherBalanceTransactionEntityBuildParams = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    teacher: JoinedUserDoc;
    packageTransaction: PackageTransactionDoc;
  }): Promise<BalanceTransactionEntityBuildParams> => {
    const { balanceTransactionEntityBuildParams, teacher, packageTransaction } = props;
    const debitTeacherBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams =
      this._cloneDeep(balanceTransactionEntityBuildParams);
    debitTeacherBalanceTransactionEntityBuildParams.userId = teacher._id;
    debitTeacherBalanceTransactionEntityBuildParams.paymentData = undefined;
    debitTeacherBalanceTransactionEntityBuildParams.processingFee =
      await this._getTeacherProcessingFee({
        debitTeacherBalanceTransactionEntityBuildParams,
        teacher,
        packageTransaction,
      });
    debitTeacherBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
      await this._getTeacherTotalAvailableBalance({
        debitTeacherBalanceTransactionEntityBuildParams,
        teacher,
      });
    debitTeacherBalanceTransactionEntityBuildParams.status =
      BALANCE_TRANSACTION_ENTITY_STATUS.PENDING;
    return debitTeacherBalanceTransactionEntityBuildParams;
  };

  private _getTeacherProcessingFee = async (props: {
    debitTeacherBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    teacher: JoinedUserDoc;
    packageTransaction: PackageTransactionDoc;
  }): Promise<number> => {
    const { debitTeacherBalanceTransactionEntityBuildParams, teacher, packageTransaction } = props;
    const teacherType = teacher.teacherData!.type;
    const processingRateObj = MANABU_PROCESSING_RATE[teacherType.toUpperCase()];
    const processingRateAmount = processingRateObj.amount;
    const isProTeacher = teacherType == TEACHER_ENTITY_TYPE.LICENSED;
    let processingFee;
    if (isProTeacher) {
      processingFee = await this._exchangeRateHandler.multiply({
        multiplicand: {
          amount: debitTeacherBalanceTransactionEntityBuildParams.balanceChange,
        },
        multiplier: {
          amount: processingRateAmount,
        },
        targetCurrency: DEFAULT_CURRENCY,
      });
    } else {
      processingFee = await this._exchangeRateHandler.multiply({
        multiplicand: {
          amount: packageTransaction.packageData.lessonAmount,
        },
        multiplier: {
          amount: processingRateAmount,
          sourceCurrency: processingRateObj.currency,
        },
        targetCurrency: DEFAULT_CURRENCY,
      });
    }
    return processingFee * -1;
  };

  private _getTeacherTotalAvailableBalance = async (props: {
    debitTeacherBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    teacher: JoinedUserDoc;
  }): Promise<number> => {
    const { debitTeacherBalanceTransactionEntityBuildParams, teacher } = props;
    const totalPayment = await this._exchangeRateHandler.add({
      addend1: {
        amount: debitTeacherBalanceTransactionEntityBuildParams.balanceChange,
        sourceCurrency: debitTeacherBalanceTransactionEntityBuildParams.currency,
      },
      addend2: {
        amount: debitTeacherBalanceTransactionEntityBuildParams.processingFee,
        sourceCurrency: debitTeacherBalanceTransactionEntityBuildParams.currency,
      },
      targetCurrency: DEFAULT_CURRENCY,
    });
    const totalAvailableBalance = await this._exchangeRateHandler.add({
      addend1: {
        amount: totalPayment,
        sourceCurrency: DEFAULT_CURRENCY,
      },
      addend2: {
        amount: teacher.balance.totalAvailable,
        sourceCurrency: teacher.balance.currency,
      },
      targetCurrency: teacher.balance.currency,
    });
    return totalAvailableBalance;
  };

  private _editTeacherPendingBalance = async (props: {
    usecaseRes: CreatePackageTransactionUsecaseResponse;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<void> => {
    const { usecaseRes, dbServiceAccessOptions, session } = props;
    const { balanceTransactions } = usecaseRes;
    const debitTeacherBalanceTransaction = balanceTransactions[2];
    const teacherTotalPayment = debitTeacherBalanceTransaction.totalPayment;
    const updatedTeacher = await this._userDbService.findOneAndUpdate({
      searchQuery: {
        _id: debitTeacherBalanceTransaction.userId,
      },
      updateQuery: {
        $inc: {
          'balance.totalPending': teacherTotalPayment,
          'balance.totalAvailable': teacherTotalPayment,
        },
      },
      dbServiceAccessOptions,
      session,
    });
  };

  private _createIncomeReport = async (
    balanceTransactions: BalanceTransactionDoc[]
  ): Promise<IncomeReportDoc> => {
    const debitTeacherBalanceTransaction = balanceTransactions[2];
    const createIncomeReportControllerData = await this._getIncomeReportControllerData(
      debitTeacherBalanceTransaction
    );
    const createIncomeReportRes = await this._createIncomeReportUsecase.makeRequest(
      createIncomeReportControllerData
    );
    const { incomeReport } = createIncomeReportRes;
    return incomeReport;
  };

  private _getIncomeReportControllerData = async (
    debitTeacherBalanceTransaction: BalanceTransactionDoc
  ): Promise<ControllerData> => {
    const { currency, balanceChange, totalPayment } = debitTeacherBalanceTransaction;
    const currentAPIUser = {
      userId: undefined,
      role: 'admin',
    };
    const convertedRevenue = await this._exchangeRateHandler.convert({
      amount: balanceChange,
      sourceCurrency: currency,
      targetCurrency: DEFAULT_CURRENCY,
    });
    const convertedWageExpense =
      (await this._exchangeRateHandler.convert({
        amount: totalPayment,
        sourceCurrency: currency,
        targetCurrency: DEFAULT_CURRENCY,
      })) * -1;
    const createIncomeReportRouteData = {
      rawBody: {},
      headers: {},
      params: {},
      body: {
        revenue: convertedRevenue,
        wageExpense: convertedWageExpense,
      },
      query: {},
      endpointPath: '',
    };
    const createIncomeReportControllerData = this._controllerDataBuilder
      .routeData(createIncomeReportRouteData)
      .currentAPIUser(currentAPIUser)
      .build();
    return createIncomeReportControllerData;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePackageTransactionUsecaseInitParams
  ): Promise<void> => {
    const {
      makeJwtHandler,
      makeCacheDbService,
      makePackageTransactionEntity,
      makeUserDbService,
      makeExchangeRateHandler,
      makeCreateBalanceTransactionsUsecase,
      makeControllerDataBuilder,
      makeEmailHandler,
      makeCreateIncomeReportUsecase,
    } = optionalInitParams;
    this._jwtHandler = await makeJwtHandler;
    this._cacheDbService = await makeCacheDbService;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._userDbService = await makeUserDbService;
    this._exchangeRateHandler = await makeExchangeRateHandler;
    this._createBalanceTransactionsUsecase = await makeCreateBalanceTransactionsUsecase;
    this._controllerDataBuilder = makeControllerDataBuilder;
    this._emailHandler = await makeEmailHandler;
    this._createIncomeReportUsecase = await makeCreateIncomeReportUsecase;
  };
}

export { CreatePackageTransactionUsecase, CreatePackageTransactionUsecaseResponse };
