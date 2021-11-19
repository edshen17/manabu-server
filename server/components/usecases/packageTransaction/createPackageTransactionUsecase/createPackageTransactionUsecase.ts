import { ClientSession } from 'mongoose';
import { DEFAULT_CURRENCY, MANABU_PROCESSING_RATE } from '../../../../constants';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { BalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  BalanceTransactionEntity,
  BalanceTransactionEntityBuildParams,
  BALANCE_TRANSACTION_ENTITY_STATUS,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import {
  PackageTransactionEntity,
  PackageTransactionEntityBuildParams,
} from '../../../entities/packageTransaction/packageTransactionEntity';
import { PAYMENT_GATEWAY_NAME } from '../../../paymentHandlers/abstractions/IPaymentHandler';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CHECKOUT_TOKEN_HASH_KEY } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { ExchangeRateHandler } from '../../utils/exchangeRateHandler/exchangeRateHandler';
import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';

type OptionalCreatePackageTransactionUsecaseInitParams = {
  makeJwtHandler: Promise<JwtHandler>;
  makeCacheDbService: Promise<CacheDbService>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeBalanceTransactionEntity: Promise<BalanceTransactionEntity>;
  makeBalanceTransactionDbService: Promise<BalanceTransactionDbService>;
  makeUserDbService: Promise<UserDbService>;
  makeExchangeRateHandler: Promise<ExchangeRateHandler>;
};

type CreatePackageTransactionUsecaseResponse = {
  packageTransaction: PackageTransactionDoc;
  balanceTransactions: BalanceTransactionDoc[];
};

class CreatePackageTransactionUsecase extends AbstractCreateUsecase<
  OptionalCreatePackageTransactionUsecaseInitParams,
  CreatePackageTransactionUsecaseResponse,
  PackageTransactionDbServiceResponse
> {
  private _jwtHandler!: JwtHandler;
  private _cacheDbService!: CacheDbService;
  private _packageTransactionEntity!: PackageTransactionEntity;
  private _balanceTransactionEntity!: BalanceTransactionEntity;
  private _balanceTransactionDbService!: BalanceTransactionDbService;
  private _userDbService!: UserDbService;
  private _exchangeRateHandler!: ExchangeRateHandler;
  private _defaultCurrency: string = DEFAULT_CURRENCY;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackageTransactionUsecaseResponse> => {
    const { query, dbServiceAccessOptions } = props;
    const { token, paymentId } = query;
    const verifiedJwt = await this._getVerifiedJwt(token);
    const { packageTransactionEntityBuildParams, balanceTransactionEntityBuildParams } =
      verifiedJwt;
    const session = await this._balanceTransactionDbService.startSession();
    session.startTransaction();
    let usecaseRes!: CreatePackageTransactionUsecaseResponse;
    try {
      const packageTransaction = await this._createPackageTransaction({
        packageTransactionEntityBuildParams,
        dbServiceAccessOptions,
        session,
      });
      const balanceTransactions = await this._createBalanceTransactions({
        packageTransaction,
        balanceTransactionEntityBuildParams,
        dbServiceAccessOptions,
        paymentId,
        session,
      });
      await this._editTeacherPendingBalance({
        teacherPayoutBalanceTransaction: balanceTransactions[2],
        dbServiceAccessOptions,
        session,
      });
      usecaseRes = {
        packageTransaction,
        balanceTransactions,
      };
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
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

  private _createBalanceTransactions = async (props: {
    packageTransaction: PackageTransactionDoc;
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    paymentId: string;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<BalanceTransactionDoc[]> => {
    const {
      packageTransaction,
      dbServiceAccessOptions,
      balanceTransactionEntityBuildParams,
      paymentId,
      session,
    } = props;
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
    balanceTransactionEntityBuildParams.packageTransactionId = packageTransaction._id;
    balanceTransactionEntityBuildParams.paymentData.id = paymentId;
    const debitBalanceTransaction = await this._createDebitBalanceTransaction({
      balanceTransactionEntityBuildParams,
      user,
      dbServiceAccessOptions,
      session,
    });
    const creditBalanceTransaction = await this._createCreditBalanceTransaction({
      balanceTransactionEntityBuildParams,
      debitBalanceTransaction,
      user,
      dbServiceAccessOptions,
      session,
    });
    const teacherPayoutBalanceTransaction = await this._createTeacherPayoutBalanceTransaction({
      balanceTransactionEntityBuildParams,
      dbServiceAccessOptions,
      session,
      teacher,
    });
    const balanceTransactions = [
      debitBalanceTransaction,
      creditBalanceTransaction,
      teacherPayoutBalanceTransaction,
    ];
    return balanceTransactions;
  };

  private _createDebitBalanceTransaction = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<BalanceTransactionDoc> => {
    const { balanceTransactionEntityBuildParams, user, dbServiceAccessOptions, session } = props;
    const debitBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams =
      this._cloneDeep(balanceTransactionEntityBuildParams);
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
        targetCurrency: this._defaultCurrency,
      });
    const debitBalanceTransaction = await this._createBalanceTransaction({
      balanceTransactionEntityBuildParams: debitBalanceTransactionEntityBuildParams,
      dbServiceAccessOptions,
      session,
    });
    return debitBalanceTransaction;
  };

  private _createBalanceTransaction = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<BalanceTransactionDoc> => {
    const { balanceTransactionEntityBuildParams, dbServiceAccessOptions, session } = props;
    const balanceTransactionEntity = await this._balanceTransactionEntity.build({
      ...balanceTransactionEntityBuildParams,
    });
    const balanceTransaction = await this._balanceTransactionDbService.insert({
      modelToInsert: balanceTransactionEntity,
      dbServiceAccessOptions,
      session,
    });
    return balanceTransaction;
  };

  private _createCreditBalanceTransaction = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    debitBalanceTransaction: BalanceTransactionDoc;
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<BalanceTransactionDoc> => {
    const {
      balanceTransactionEntityBuildParams,
      debitBalanceTransaction,
      user,
      dbServiceAccessOptions,
      session,
    } = props;
    const creditBalanceTransactionEntityBuildParams = this._cloneDeep(
      balanceTransactionEntityBuildParams
    );
    creditBalanceTransactionEntityBuildParams.balanceChange =
      await this._exchangeRateHandler.multiply({
        multiplicand: {
          amount: debitBalanceTransaction.balanceChange,
        },
        multiplier: {
          amount: -1,
        },
        targetCurrency: this._defaultCurrency,
      });
    creditBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
      user.balance.totalAvailable;
    creditBalanceTransactionEntityBuildParams.processingFee = 0;
    creditBalanceTransactionEntityBuildParams.totalPayment =
      creditBalanceTransactionEntityBuildParams.balanceChange;
    const creditBalanceTransaction = await this._createBalanceTransaction({
      balanceTransactionEntityBuildParams: creditBalanceTransactionEntityBuildParams,
      dbServiceAccessOptions,
      session,
    });
    return creditBalanceTransaction;
  };

  private _createTeacherPayoutBalanceTransaction = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
    teacher: JoinedUserDoc;
  }): Promise<BalanceTransactionDoc> => {
    const { balanceTransactionEntityBuildParams, dbServiceAccessOptions, session, teacher } = props;
    const teacherPayoutBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams =
      this._cloneDeep(balanceTransactionEntityBuildParams);
    teacherPayoutBalanceTransactionEntityBuildParams.userId = teacher._id;
    teacherPayoutBalanceTransactionEntityBuildParams.processingFee =
      await this._exchangeRateHandler.multiply({
        multiplicand: {
          amount: balanceTransactionEntityBuildParams.balanceChange,
        },
        multiplier: {
          amount: -1 * MANABU_PROCESSING_RATE,
        },
        targetCurrency: this._defaultCurrency,
      });
    const totalPayment = await this._exchangeRateHandler.add({
      addend1: {
        amount: balanceTransactionEntityBuildParams.balanceChange,
        sourceCurrency: balanceTransactionEntityBuildParams.currency,
      },
      addend2: {
        amount: teacherPayoutBalanceTransactionEntityBuildParams.processingFee,
        sourceCurrency: teacherPayoutBalanceTransactionEntityBuildParams.currency,
      },
      targetCurrency: this._defaultCurrency,
    });
    teacherPayoutBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
      await this._exchangeRateHandler.add({
        addend1: {
          amount: totalPayment,
          sourceCurrency: this._defaultCurrency,
        },
        addend2: {
          amount: teacher.balance.totalAvailable,
          sourceCurrency: teacher.balance.currency,
        },
        targetCurrency: teacher.balance.currency,
      });
    teacherPayoutBalanceTransactionEntityBuildParams.paymentData = {
      gateway: PAYMENT_GATEWAY_NAME.NONE,
      id: '',
    };
    teacherPayoutBalanceTransactionEntityBuildParams.status =
      BALANCE_TRANSACTION_ENTITY_STATUS.PENDING;
    const teacherPayoutBalanceTransaction = await this._createBalanceTransaction({
      balanceTransactionEntityBuildParams: teacherPayoutBalanceTransactionEntityBuildParams,
      dbServiceAccessOptions,
      session,
    });
    return teacherPayoutBalanceTransaction;
  };

  private _editTeacherPendingBalance = async (props: {
    teacherPayoutBalanceTransaction: BalanceTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<void> => {
    const { teacherPayoutBalanceTransaction, dbServiceAccessOptions, session } = props;
    const teacherTotalPayment = teacherPayoutBalanceTransaction.totalPayment;
    const updatedTeacher = await this._userDbService.findOneAndUpdate({
      searchQuery: {
        _id: teacherPayoutBalanceTransaction.userId,
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

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePackageTransactionUsecaseInitParams
  ): Promise<void> => {
    const {
      makeJwtHandler,
      makeCacheDbService,
      makePackageTransactionEntity,
      makeBalanceTransactionDbService,
      makeBalanceTransactionEntity,
      makeUserDbService,
      makeExchangeRateHandler,
    } = optionalInitParams;
    this._jwtHandler = await makeJwtHandler;
    this._cacheDbService = await makeCacheDbService;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._balanceTransactionDbService = await makeBalanceTransactionDbService;
    this._balanceTransactionEntity = await makeBalanceTransactionEntity;
    this._userDbService = await makeUserDbService;
    this._exchangeRateHandler = await makeExchangeRateHandler;
  };
}

export { CreatePackageTransactionUsecase, CreatePackageTransactionUsecaseResponse };
