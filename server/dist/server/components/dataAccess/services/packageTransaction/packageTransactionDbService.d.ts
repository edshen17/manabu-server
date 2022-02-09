import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { PackageDbService } from '../package/packageDbService';
import { UserDbService } from '../user/userDbService';
declare type OptionalPackageTransactionDbServiceInitParams = {
    makeUserDbService: Promise<UserDbService>;
    makePackageDbService: Promise<PackageDbService>;
};
declare type PackageTransactionDbServiceResponse = PackageTransactionDoc;
declare class PackageTransactionDbService extends AbstractDbService<OptionalPackageTransactionDbServiceInitParams, PackageTransactionDbServiceResponse> {
    private _userDbService;
    private _packageDbService;
    protected _getComputedProps: (props: {
        dbDoc: PackageTransactionDoc;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<StringKeyObject>;
    protected _initTemplate: (optionalDbServiceInitParams: OptionalPackageTransactionDbServiceInitParams) => Promise<void>;
}
export { PackageTransactionDbService, PackageTransactionDbServiceResponse };
