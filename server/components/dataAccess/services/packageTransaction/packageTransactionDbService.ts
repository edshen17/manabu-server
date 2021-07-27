import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { PackageDbService } from '../package/packageDbService';
import { UserDbService } from '../user/userDbService';
import { DB_SERVICE_JOIN_TYPE } from '../../abstractions/IDbService';

type OptionalPackageTransactionDbServiceInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageDbService: Promise<PackageDbService>;
};

class PackageTransactionDbService extends AbstractDbService<
  OptionalPackageTransactionDbServiceInitParams,
  PackageTransactionDoc
> {
  private _userDbService!: UserDbService;
  private _packageDbService!: PackageDbService;
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }

  protected _getForeignKeyObj = (): {} => {
    return {
      hostedByData: {
        dbService: this._userDbService,
        foreignKeyName: 'hostedById',
      },
      reservedByData: {
        dbService: this._userDbService,
        foreignKeyName: 'reservedById',
      },
      packageData: {
        dbService: this._packageDbService,
        foreignKeyName: 'packageId',
      },
    };
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalPackageTransactionDbServiceInitParams
  ) => {
    const { makeUserDbService, makePackageDbService } = optionalDbServiceInitParams;
    this._userDbService = await makeUserDbService;
    this._packageDbService = await makePackageDbService;
    this._joinType = DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
  };
}

export { PackageTransactionDbService };
