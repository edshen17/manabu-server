import { PackageDoc } from '../../../../models/Package';
import { StringKeyObject } from '../../../../types/custom';
import { PackageDbServiceResponse } from '../../../dataAccess/services/package/packageDbService';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalEditPackageUsecaseInitParams = {};
declare type EditPackageUsecaseResponse = {
    package: PackageDoc;
};
declare class EditPackageUsecase extends AbstractEditUsecase<OptionalEditPackageUsecaseInitParams, EditPackageUsecaseResponse, PackageDbServiceResponse> {
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<EditPackageUsecaseResponse>;
    private _editPackage;
}
export { EditPackageUsecase, EditPackageUsecaseResponse };
