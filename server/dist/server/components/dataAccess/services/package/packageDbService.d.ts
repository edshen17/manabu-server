import { PackageDoc } from '../../../../models/Package';
import { JoinedUserDoc } from '../../../../models/User';
import { AbstractEmbeddedDbService, AbstractEmbeddedDbServiceInitParams } from '../../abstractions/AbstractEmbeddedDbService';
declare type OptionalPackageDbServiceInitParams = {};
declare type PackageDbServiceResponse = PackageDoc | JoinedUserDoc;
declare class PackageDbService extends AbstractEmbeddedDbService<OptionalPackageDbServiceInitParams, PackageDbServiceResponse> {
    protected _initTemplate: (optionalDbServiceInitParams: AbstractEmbeddedDbServiceInitParams<OptionalPackageDbServiceInitParams>) => Promise<void>;
}
export { PackageDbService, PackageDbServiceResponse };
