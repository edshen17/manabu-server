import { PackageDoc } from '../../../../models/Package';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import { PackageEntity } from '../../../entities/package/packageEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalCreatePackagesUsecaseInitParams = {
    makePackageEntity: Promise<PackageEntity>;
};
declare type CreatePackagesUsecaseResponse = {
    packages: PackageDoc[];
};
declare class CreatePackagesUsecase extends AbstractCreateUsecase<OptionalCreatePackagesUsecaseInitParams, CreatePackagesUsecaseResponse, TeacherDbServiceResponse> {
    private _packageEntity;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreatePackagesUsecaseResponse>;
    private _createPackages;
    private _createPackage;
    private _getCreatedPackages;
    protected _initTemplate: (optionalInitParams: OptionalCreatePackagesUsecaseInitParams) => Promise<void>;
}
export { CreatePackagesUsecase, CreatePackagesUsecaseResponse };
