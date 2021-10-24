import { ObjectId } from 'mongoose';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetPackageTransactionUsecaseInitParams = {};

type GetPackageTransactionUsecaseResponse = { packageTransaction: PackageTransactionDoc };

class GetPackageTransactionUsecase extends AbstractGetUsecase<
  OptionalGetPackageTransactionUsecaseInitParams,
  GetPackageTransactionUsecaseResponse,
  PackageTransactionDbServiceResponse
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
  ): Promise<GetPackageTransactionUsecaseResponse> => {
    const { params, dbServiceAccessOptions } = props;
    const { packageTransactionId } = params;
    const packageTransaction = await this._getPackageTransaction({
      packageTransactionId,
      dbServiceAccessOptions,
    });
    if (!packageTransaction) {
      throw new Error('Package transaction not found.');
    }
    return { packageTransaction };
  };

  private _getPackageTransaction = async (props: {
    packageTransactionId: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageTransactionDoc> => {
    const { packageTransactionId, dbServiceAccessOptions } = props;
    const packageTransaction = await this._dbService.findById({
      _id: packageTransactionId,
      dbServiceAccessOptions,
    });
    return packageTransaction;
  };
}

export { GetPackageTransactionUsecase, GetPackageTransactionUsecaseResponse };
