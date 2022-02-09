import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
declare type OptionalBalanceTransactionDbServiceInitParams = {
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};
declare type BalanceTransactionDbServiceResponse = BalanceTransactionDoc;
declare class BalanceTransactionDbService extends AbstractDbService<OptionalBalanceTransactionDbServiceInitParams, BalanceTransactionDbServiceResponse> {
    private _packageTransactionDbService;
    protected _getComputedProps: (props: {
        dbDoc: BalanceTransactionDoc;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<StringKeyObject>;
    protected _initTemplate: (optionalDbServiceInitParams: OptionalBalanceTransactionDbServiceInitParams) => Promise<void>;
}
export { BalanceTransactionDbService, BalanceTransactionDbServiceResponse };
