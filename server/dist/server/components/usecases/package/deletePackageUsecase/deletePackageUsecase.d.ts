import { PackageDoc } from '../../../../models/Package';
import { StringKeyObject } from '../../../../types/custom';
import { PackageDbServiceResponse } from '../../../dataAccess/services/package/packageDbService';
import { AbstractDeleteUsecase } from '../../abstractions/AbstractDeleteUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalDeletePackageUsecaseInitParams = {};
declare type DeletePackageUsecaseResponse = {
    package: PackageDoc;
};
declare class DeletePackageUsecase extends AbstractDeleteUsecase<OptionalDeletePackageUsecaseInitParams, DeletePackageUsecaseResponse, PackageDbServiceResponse> {
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<DeletePackageUsecaseResponse>;
    private _deletePackage;
}
export { DeletePackageUsecase, DeletePackageUsecaseResponse };
