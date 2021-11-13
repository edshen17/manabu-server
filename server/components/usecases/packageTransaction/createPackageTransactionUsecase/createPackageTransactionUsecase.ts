import { ObjectId } from 'mongoose';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { BalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  BalanceTransactionEntity,
  BalanceTransactionEntityBuildResponse,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
  RunningBalance,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import {
  PackageTransactionEntity,
  PackageTransactionEntityBuildParams,
} from '../../../entities/packageTransaction/packageTransactionEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CHECKOUT_TOKEN_HASH_KEY } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';

type OptionalCreatePackageTransactionUsecaseInitParams = {
  makeJwtHandler: Promise<JwtHandler>;
  makeCacheDbService: Promise<CacheDbService>;
  makePackageTransactionEntity: Promise<PackageTransactionEntity>;
  makeBalanceTransactionEntity: Promise<BalanceTransactionEntity>;
  makeBalanceTransactionDbService: Promise<BalanceTransactionDbService>;
  makeUserDbService: Promise<UserDbService>;
};

type CreatePackageTransactionUsecaseResponse = {
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
  private _balanceTransactionEntity!: BalanceTransactionEntity;
  private _balanceTransactionDbService!: BalanceTransactionDbService;
  private _userDbService!: UserDbService;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackageTransactionUsecaseResponse> => {
    const { query, dbServiceAccessOptions } = props;
    const packageTransactionEntityBuildParams: PackageTransactionEntityBuildParams =
      await this._getPackageTransactionEntityBuildParams(query);
    const packageTransaction = await this._createPackageTransaction({
      packageTransactionEntityBuildParams,
      dbServiceAccessOptions,
    });
    // await this._createBalanceTransaction(packageTransaction);
    const usecaseRes = {
      packageTransaction,
    };
    return usecaseRes;
  };

  private _getPackageTransactionEntityBuildParams = async (
    query: StringKeyObject
  ): Promise<PackageTransactionEntityBuildParams> => {
    const { token, paymentId } = query;
    const jwt = await this._cacheDbService.get({
      hashKey: CHECKOUT_TOKEN_HASH_KEY,
      key: token,
    });
    const { packageTransactionEntityBuildParams } = await this._jwtHandler.verify(jwt);
    await this._jwtHandler.blacklist(jwt);
    return packageTransactionEntityBuildParams;
  };

  private _createPackageTransaction = async (props: {
    packageTransactionEntityBuildParams: PackageTransactionEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageTransactionDoc> => {
    const { packageTransactionEntityBuildParams, dbServiceAccessOptions } = props;
    const packageTransactionEntity = await this._packageTransactionEntity.build(
      packageTransactionEntityBuildParams
    );
    const packageTransaction = await this._dbService.insert({
      modelToInsert: packageTransactionEntity,
      dbServiceAccessOptions,
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

  // private _createBalanceTransaction = async (
  //   packageTransaction: PackageTransactionDoc
  // ): Promise<BalanceTransactionDoc[]> => {
  //   const session = await this._balanceTransactionDbService.startSession();
  //   const dbServiceAccessOptions =
  //     this._balanceTransactionDbService.getOverrideDbServiceAccessOptions();
  //   const user = await this._userDbService.findById({
  //     _id: packageTransaction.reservedById,
  //     dbServiceAccessOptions,
  //   });
  //   const creditPurchaseBalanceTransaction = await this._createBalanceTransactionEntity({ userId: user._id, description: '', amount:  })
  //   // create 2 balance transactions - 1 for credit purchase +, 1 for package transaction -
  //   // running balance?? - compute by getting current user's balance
  //   // userBalanceHandler.add({ amount: 60, userId, session, desc });
  // };

  private _createBalanceTransactionEntity = async (props: {
    userId: ObjectId;
    description: string;
    amount: number;
    packageTransactionId: ObjectId;
    runningBalance: RunningBalance;
  }): Promise<BalanceTransactionEntityBuildResponse> => {
    const { userId, description, amount, packageTransactionId, runningBalance } = props;
    const balanceTransactionEntity = await this._balanceTransactionEntity.build({
      userId,
      status: BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
      currency: 'SGD',
      type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
      packageTransactionId: packageTransactionId,
      amount: 100,
      processingFee: 5,
      tax: 0.2,
      total: 105.2,
      runningBalance: {
        currency: 'SGD',
        totalAvailable: 0,
      },
      paymentData: {
        gateway: 'paypal',
        id: 'some id',
      },
    });
    return balanceTransactionEntity;
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
    } = optionalInitParams;
    this._jwtHandler = await makeJwtHandler;
    this._cacheDbService = await makeCacheDbService;
    this._packageTransactionEntity = await makePackageTransactionEntity;
    this._balanceTransactionDbService = await makeBalanceTransactionDbService;
    this._balanceTransactionEntity = await makeBalanceTransactionEntity;
    this._userDbService = await makeUserDbService;
  };
}

export { CreatePackageTransactionUsecase, CreatePackageTransactionUsecaseResponse };
