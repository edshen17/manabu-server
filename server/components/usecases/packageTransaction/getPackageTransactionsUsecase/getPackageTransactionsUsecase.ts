import { ObjectId } from 'mongoose';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetPackageTransactionsUsecaseInitParams = {};

type GetPackageTransactionsUsecaseResponse = { packageTransactions: PackageTransactionDoc[] };

class GetPackageTransactionsUsecase extends AbstractGetUsecase<
  OptionalGetPackageTransactionsUsecaseInitParams,
  GetPackageTransactionsUsecaseResponse,
  PackageTransactionDoc
> {
  protected _isProtectedResource = (): boolean => {
    return true;
  };

  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'packageTransactionId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetPackageTransactionsUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions, query } = props;
    const { role } = currentAPIUser;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const userId = isSelf ? currentAPIUser.userId : params.userId;
    const packageTransactions = await this._getPackageTransactions({
      userId,
      query,
      dbServiceAccessOptions,
    });
    const isAccessUnathorized = params.userId && role != 'admin';
    if (!packageTransactions) {
      throw new Error('Package transactions not found.');
    }
    if (isAccessUnathorized) {
      throw new Error('Access denied.');
    }
    return { packageTransactions };
  };

  private _getPackageTransactions = async (props: {
    userId: ObjectId;
    query: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageTransactionDoc[]> => {
    const { userId, query, dbServiceAccessOptions } = props;
    const searchQuery = this._processQuery({ query, userId });
    const fallbackQuery = { page: 0, limit: 15 };
    const sort = { createdDate: 1 };
    const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
    const packageTransactions = await this._dbService.find({
      searchQuery,
      dbServiceAccessOptions,
      paginationOptions,
    });
    return packageTransactions;
  };

  private _processQuery = (props: {
    userId: ObjectId;
    query: StringKeyObject;
  }): StringKeyObject => {
    const { userId } = props;
    const searchQuery = {
      $or: [
        {
          reservedById: userId,
        },
        {
          hostedById: userId,
        },
      ],
    };
    return searchQuery;
  };
}

export { GetPackageTransactionsUsecase, GetPackageTransactionsUsecaseResponse };
