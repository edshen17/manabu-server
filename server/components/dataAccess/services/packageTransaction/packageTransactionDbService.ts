import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import {
  DbServiceAccessOptions,
  DB_SERVICE_COLLECTIONS,
  DB_SERVICE_JOIN_TYPE,
} from '../../abstractions/IDbService';
import { PackageDbService } from '../package/packageDbService';
import { UserDbService } from '../user/userDbService';

type OptionalPackageTransactionDbServiceInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageDbService: Promise<PackageDbService>;
};

type PackageTransactionDbServiceResponse = PackageTransactionDoc;

class PackageTransactionDbService extends AbstractDbService<
  OptionalPackageTransactionDbServiceInitParams,
  PackageTransactionDbServiceResponse
> {
  private _userDbService!: UserDbService;
  private _packageDbService!: PackageDbService;

  protected _getComputedProps = async (props: {
    dbDoc: PackageTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    const { dbDoc, dbServiceAccessOptions } = props;
    const { hostedById, reservedById, packageId } = dbDoc;
    const hostedByData = await this._getDbDataById({
      dbService: this._userDbService,
      dbServiceAccessOptions,
      _id: hostedById,
    });
    const reservedByData = await this._getDbDataById({
      dbService: this._userDbService,
      dbServiceAccessOptions,
      _id: reservedById,
    });
    const packageData = await this._getDbDataById({
      dbService: this._packageDbService,
      dbServiceAccessOptions,
      _id: packageId,
    });
    const computedProps = {
      hostedByData,
      reservedByData,
      packageData,
    };
    return computedProps;
  };

  protected _getCacheDependencies = (): string[] => {
    return [DB_SERVICE_COLLECTIONS.APPOINTMENTS];
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

export { PackageTransactionDbService, PackageTransactionDbServiceResponse };
