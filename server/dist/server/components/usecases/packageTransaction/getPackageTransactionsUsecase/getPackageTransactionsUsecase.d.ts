import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetPackageTransactionsUsecaseInitParams = {};
declare type GetPackageTransactionsUsecaseResponse = {
    packageTransactions: PackageTransactionDoc[];
};
declare class GetPackageTransactionsUsecase extends AbstractGetUsecase<OptionalGetPackageTransactionsUsecaseInitParams, GetPackageTransactionsUsecaseResponse, PackageTransactionDbServiceResponse> {
    protected _isProtectedResource: () => boolean;
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetPackageTransactionsUsecaseResponse>;
    private _getPackageTransactions;
    private _processQuery;
}
export { GetPackageTransactionsUsecase, GetPackageTransactionsUsecaseResponse };
