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

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackageTransactionUsecaseResponse> => {
    const { query, dbServiceAccessOptions } = props;
    const session = await this._balanceTransactionDbService.startSession();
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
    const balanceTransactions = await this._createBalanceTransactions({
      packageTransaction,
      balanceTransactionEntityBuildParams,
      dbServiceAccessOptions,
      paymentId,
      session,
    });
    const usecaseRes = { packageTransaction, balanceTransactions };
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
    const { user, teacher } = await this._getUserDataFromPackageTransaction({
      packageTransaction,
      dbServiceAccessOptions,
      session,
    });
    balanceTransactionEntityBuildParams.packageTransactionId = packageTransaction._id;
    balanceTransactionEntityBuildParams.paymentData!.id = paymentId;
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

  private _createDebitBalanceTransaction = async (props: {
    balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    user: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<BalanceTransactionDoc> => {
    const { balanceTransactionEntityBuildParams, user, dbServiceAccessOptions, session } = props;
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
        targetCurrency: DEFAULT_CURRENCY,
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
    teacherPayoutBalanceTransactionEntityBuildParams.paymentData = undefined;
    teacherPayoutBalanceTransactionEntityBuildParams.processingFee =
      await this._getTeacherPayoutProcessingFee(teacherPayoutBalanceTransactionEntityBuildParams);
    teacherPayoutBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
      await this._getTeacherPayoutTotalAvailableBalance({
        teacherPayoutBalanceTransactionEntityBuildParams,
        teacher,
      });
    teacherPayoutBalanceTransactionEntityBuildParams.status =
      BALANCE_TRANSACTION_ENTITY_STATUS.PENDING;
    const teacherPayoutBalanceTransaction = await this._createBalanceTransaction({
      balanceTransactionEntityBuildParams: teacherPayoutBalanceTransactionEntityBuildParams,
      dbServiceAccessOptions,
      session,
    });
    return teacherPayoutBalanceTransaction;
  };

  private _getTeacherPayoutProcessingFee = async (
    teacherPayoutBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams
  ): Promise<number> => {
    const processingFee = await this._exchangeRateHandler.multiply({
      multiplicand: {
        amount: teacherPayoutBalanceTransactionEntityBuildParams.balanceChange,
      },
      multiplier: {
        amount: -1 * MANABU_PROCESSING_RATE, // change to 16% if pro, 1250 yen if community
      },
      targetCurrency: DEFAULT_CURRENCY,
    });
    return processingFee;
  };

  private _getTeacherPayoutTotalAvailableBalance = async (props: {
    teacherPayoutBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams;
    teacher: JoinedUserDoc;
  }): Promise<number> => {
    const { teacherPayoutBalanceTransactionEntityBuildParams, teacher } = props;
    const totalPayment = await this._exchangeRateHandler.add({
      addend1: {
        amount: teacherPayoutBalanceTransactionEntityBuildParams.balanceChange,
        sourceCurrency: teacherPayoutBalanceTransactionEntityBuildParams.currency,
      },
      addend2: {
        amount: teacherPayoutBalanceTransactionEntityBuildParams.processingFee,
        sourceCurrency: teacherPayoutBalanceTransactionEntityBuildParams.currency,
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
    const teacherPayoutBalanceTransaction = balanceTransactions[2];
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
