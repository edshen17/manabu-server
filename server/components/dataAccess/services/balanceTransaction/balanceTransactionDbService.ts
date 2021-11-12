import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DbServiceAccessOptions, DB_SERVICE_JOIN_TYPE } from '../../abstractions/IDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';

type OptionalBalanceTransactionDbServiceInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

type BalanceTransactionDbServiceResponse = BalanceTransactionDoc;

class BalanceTransactionDbService extends AbstractDbService<
  OptionalBalanceTransactionDbServiceInitParams,
  BalanceTransactionDbServiceResponse
> {
  private _packageTransactionDbService!: PackageTransactionDbService;

  protected _getComputedProps = async (props: {
    dbDoc: BalanceTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    const { dbDoc, dbServiceAccessOptions } = props;
    const { packageTransactionId } = dbDoc;
    const packageTransactionData = await this._getDbDataById({
      dbService: this._packageTransactionDbService,
      dbServiceAccessOptions,
      _id: packageTransactionId,
    });
    const computedProps = {
      packageTransactionData,
    };
    return computedProps;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalBalanceTransactionDbServiceInitParams
  ): Promise<void> => {
    const { makePackageTransactionDbService } = optionalDbServiceInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._joinType = DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
  };
}

export { BalanceTransactionDbService, BalanceTransactionDbServiceResponse };
