import { ClientSession } from 'mongoose';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { BalanceTransactionDbServiceResponse } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import {
  BalanceTransactionEntity,
  BalanceTransactionEntityBuildParams,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateBalanceTransactionsUsecaseInitParams = {
  makeBalanceTransactionEntity: Promise<BalanceTransactionEntity>;
};

type CreateBalanceTransactionsUsecaseResponse = {
  balanceTransactions: BalanceTransactionDoc[];
};

class CreateBalanceTransactionsUsecase extends AbstractCreateUsecase<
  OptionalCreateBalanceTransactionsUsecaseInitParams,
  CreateBalanceTransactionsUsecaseResponse,
  BalanceTransactionDbServiceResponse
> {
  private _balanceTransactionEntity!: BalanceTransactionEntity;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateBalanceTransactionsUsecaseResponse> => {
    const { body, dbServiceAccessOptions, currentAPIUser } = props;
    const { balanceTransactions, session } = body;
    const savedDbBalanceTransactions = await this._createBalanceTransactions({
      balanceTransactions,
      dbServiceAccessOptions,
      currentAPIUser,
      session,
    });
    const usecaseRes = {
      balanceTransactions: savedDbBalanceTransactions,
    };
    return usecaseRes;
  };

  private _createBalanceTransactions = async (props: {
    balanceTransactions: BalanceTransactionEntityBuildParams[];
    dbServiceAccessOptions: DbServiceAccessOptions;
    currentAPIUser: CurrentAPIUser;
    session?: ClientSession;
  }): Promise<BalanceTransactionDoc[]> => {
    const { balanceTransactions, dbServiceAccessOptions, session } = props;
    const modelToInsert: BalanceTransactionEntityBuildParams[] = [];
    for (const balanceTransaction of balanceTransactions) {
      await this._createBalanceTransaction({ balanceTransaction, modelToInsert });
    }
    const savedDbBalanceTransactions = await this._dbService.insertMany({
      modelToInsert,
      dbServiceAccessOptions,
      session,
    });
    return savedDbBalanceTransactions;
  };

  private _createBalanceTransaction = async (props: {
    balanceTransaction: BalanceTransactionEntityBuildParams;
    modelToInsert: BalanceTransactionEntityBuildParams[];
  }): Promise<void> => {
    const { balanceTransaction, modelToInsert } = props;
    const balanceTransactionEntity = await this._balanceTransactionEntity.build({
      ...balanceTransaction,
    });
    modelToInsert.push(balanceTransactionEntity);
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateBalanceTransactionsUsecaseInitParams
  ): Promise<void> => {
    const { makeBalanceTransactionEntity } = optionalInitParams;
    this._balanceTransactionEntity = await makeBalanceTransactionEntity;
  };
}

export { CreateBalanceTransactionsUsecase, CreateBalanceTransactionsUsecaseResponse };
