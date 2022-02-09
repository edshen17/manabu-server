import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetPackageTransactionUsecaseInitParams = {};
declare type GetPackageTransactionUsecaseResponse = {
    packageTransaction: PackageTransactionDoc;
};
declare class GetPackageTransactionUsecase extends AbstractGetUsecase<OptionalGetPackageTransactionUsecaseInitParams, GetPackageTransactionUsecaseResponse, PackageTransactionDbServiceResponse> {
    protected _isProtectedResource: () => boolean;
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetPackageTransactionUsecaseResponse>;
    private _getPackageTransaction;
}
export { GetPackageTransactionUsecase, GetPackageTransactionUsecaseResponse };
